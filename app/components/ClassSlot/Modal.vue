<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import type { ClassSlotBatchSubmitPayload, TeacherClassSlotItem } from '~~/types/class-slot'

const { teacherId } = defineProps<{
  isAdmin?: boolean
  teacherId: string
}>()

const selectedDate = shallowRef(today(getLocalTimeZone()))
const { getLocationLabel } = useClassSlotLocations()

const {
  saveClassSlot,
  deleteClassSlot,
  useClassSlotData,
} = useClassSlots(teacherId)

const { data: classSlots, refresh: refreshClassSlots, pending: isLoadingClassSlots } = await useClassSlotData()

const {
  currentDayClassSlots,
  hasClassSlotsOnDay,
  isTimeBooked,
} = useClassSlotCalendar(classSlots, selectedDate)

const selectedDateLabel = computed(() => formatClassSlotDate(selectedDate.value.toString()))
const currentPlacementLabel = computed(() => {
  return currentDayClassSlots.value.placement
    ? getLocationLabel(currentDayClassSlots.value.placement)
    : 'Todavía no hay una ubicación seleccionada para este día.'
})

const getDayColor = (day: CalendarDate) => {
  return hasClassSlotsOnDay(day) ? 'success' : undefined
}

const handleSubmit = async (payload: ClassSlotBatchSubmitPayload) => {
  const classSlotsToCreate = payload.times
    .map(time => ({
      ...payload,
      time,
    }))
    .filter(classSlot => !isTimeBooked(classSlot.date, formatClassSlotTime(classSlot.time)))

  if (classSlotsToCreate.length === 0) {
    return
  }

  await Promise.all(classSlotsToCreate.map(classSlot => saveClassSlot(classSlot)))
  await refreshClassSlots()
}

const handleDelete = async (classSlot: TeacherClassSlotItem) => {
  await deleteClassSlot({ id: classSlot.id })
  await refreshClassSlots()
}
</script>

<template lang="pug">
section.py-16
    UContainer(class="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10")
        UCalendar(v-model="selectedDate" variant="subtle")
            template(#day="{ day }")
                UChip(:show="!!getDayColor(day)" :color="getDayColor(day)" size="2xs") {{ day.day }}
        div(class="flex-1 space-y-6")
            div
                h2(class="text-2xl font-semibold") {{ selectedDateLabel }}
                p(class="text-sm text-muted") {{ currentPlacementLabel }}
            UCard(v-if="currentDayClassSlots.appointments.length" variant="soft")
                template(#header)
                    h3(class="text-lg font-semibold") Horarios
                ul(class="space-y-3")
                    li(v-for="classSlot in currentDayClassSlots.appointments" :key="classSlot.id" class="flex items-start justify-between gap-4 rounded-2xl bg-default p-4")
                        div(class="space-y-3")
                            p(class="font-medium") {{ formatClassSlotTimeLabel(classSlot.scheduledTime) }}
                            p(v-if="classSlot.notes" class="text-sm text-muted") {{ classSlot.notes }}
                            div(class="space-y-2")
                                p(class="text-sm font-medium") {{ classSlot.attendees.length }} {{ classSlot.attendees.length === 1 ? 'asistente' : 'asistentes' }}
                                ul(v-if="classSlot.attendees.length" class="space-y-1")
                                    li(v-for="attendee in classSlot.attendees" :key="attendee.bookingId" class="text-sm text-muted")
                                        | {{ attendee.name }} {{ attendee.lastName }}
                                p(v-else class="text-sm text-muted") Aún no hay personas registradas.
                        UButton(icon="i-lucide-trash-2" color="error" variant="ghost" @click="handleDelete(classSlot)")
            UCard(v-else variant="soft")
                p(class="text-sm text-muted") No hay horarios para este día.
            ClassSlotForm(:day="selectedDate" @submit="handleSubmit")
            p(v-if="isLoadingClassSlots" class="text-sm text-muted") Cargando horarios...
</template>
