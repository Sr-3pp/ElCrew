<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import type { BookingFormSchema, BookingFormState, CreateBookingPayload } from '~~/types/booking'
import type { PublicClassSlotItem } from '~~/types/class-slot'

const { isOpen } = useModal('book')
const { createBooking } = useBookings()
const { getLocationLabel } = useLocations()
const { usePublicClassSlotData } = useClassSlots()

const selectedDate = shallowRef(today(getLocalTimeZone()))
const bookingState = reactive<BookingFormState>(createBookingFormState())
const bookingError = ref<string | null>(null)
const bookingSuccess = ref<string | null>(null)
const isSubmitting = ref(false)

const { data: classSlots, refresh: refreshClassSlots, pending: isLoadingClassSlots } = await usePublicClassSlotData()

const {
  currentDayClassSlots,
  hasClassSlotsOnDay,
} = useClassSlotCalendar(classSlots, selectedDate)

const selectedDateLabel = computed(() => formatClassSlotDate(selectedDate.value.toString()))

const bookingSchema = v.object({
  classSlotId: v.pipe(v.string(), v.minLength(1, 'Selecciona una clase para continuar')),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, 'El nombre es obligatorio')),
  lastName: v.pipe(v.string(), v.trim(), v.minLength(1, 'Los apellidos son obligatorios')),
  dob: v.pipe(v.string(), v.trim(), v.minLength(1, 'La fecha de nacimiento es obligatoria')),
  notes: v.optional(v.string()),
})

watch(isOpen, async (open) => {
  bookingError.value = null
  bookingSuccess.value = null

  if (open) {
    Object.assign(bookingState, createBookingFormState())
    await refreshClassSlots()
  }
})

watch(currentDayClassSlots, () => {
  const firstClassSlot = currentDayClassSlots.value.appointments[0]
  bookingState.classSlotId = firstClassSlot?.id ?? ''
}, { immediate: true })

const getDayColor = (day: CalendarDate) => {
  return hasClassSlotsOnDay(day) ? 'success' : undefined
}

const getClassSlotLabel = (classSlot: PublicClassSlotItem) => {
  return `${formatClassSlotTimeLabel(classSlot.scheduledTime)} · ${getLocationLabel(classSlot.placement)}`
}

const handleSubmit = async (event: FormSubmitEvent<BookingFormSchema>) => {
  bookingError.value = null
  bookingSuccess.value = null
  isSubmitting.value = true

  const payload: CreateBookingPayload = {
    classSlotId: event.data.classSlotId,
    name: event.data.name.trim(),
    lastName: event.data.lastName.trim(),
    dob: event.data.dob.trim(),
    notes: event.data.notes.trim() || undefined,
  }

  try {
    await createBooking(payload)
    bookingSuccess.value = 'Tu registro a la clase quedó listo.'
  } catch (error) {
    bookingError.value = error instanceof Error
      ? error.message
      : 'No se pudo completar la reservación'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template lang="pug">
UDrawer(v-model:open="isOpen" title="Reservar una clase" description="Aparta tu lugar en un horario disponible")
    template(#body)
        div(class="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start")
            UCalendar(v-model="selectedDate" variant="subtle")
                template(#day="{ day }")
                    UChip(:show="!!getDayColor(day)" :color="getDayColor(day)" size="2xs") {{ day.day }}
            div(class="space-y-4")
                div
                    h3(class="text-xl font-semibold") {{ selectedDateLabel }}
                    p(class="text-sm text-muted") Completa tu información y elige un horario disponible para registrarte.
                UCard(v-if="currentDayClassSlots.appointments.length" variant="soft")
                    template(#header)
                        h4(class="font-semibold") Horarios disponibles
                    UForm(:schema="bookingSchema" :state="bookingState" @submit="handleSubmit" class="space-y-4")
                        UFormField(label="Horario" name="classSlotId")
                            URadioGroup(v-model="bookingState.classSlotId" :items="currentDayClassSlots.appointments.map(classSlot => ({ label: getClassSlotLabel(classSlot), value: classSlot.id }))")
                        UFormField(label="Nombre" name="name")
                            UInput(v-model="bookingState.name" placeholder="Tu nombre")
                        UFormField(label="Apellidos" name="lastName")
                            UInput(v-model="bookingState.lastName" placeholder="Tus apellidos")
                        UFormField(label="Fecha de nacimiento" name="dob")
                            UInput(v-model="bookingState.dob" type="date")
                        UFormField(label="Notas" name="notes")
                            UTextarea(v-model="bookingState.notes" placeholder="Notas opcionales para la maestra")
                        UButton(type="submit" :loading="isSubmitting" :disabled="!bookingState.classSlotId") Confirmar reservación
                        p(v-if="bookingError" class="text-sm text-error") {{ bookingError }}
                        p(v-if="bookingSuccess" class="text-sm text-success") {{ bookingSuccess }}
                UCard(v-else variant="soft")
                    p(class="text-sm text-muted")
                        | {{ isLoadingClassSlots ? 'Cargando horarios disponibles...' : 'No hay horarios disponibles para este día.' }}
</template>
