<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { AppointmentFormPayload } from '~~/types/appointment'

defineProps<{
  isAdmin?: boolean
}>()

const modelValue = shallowRef(new CalendarDate(2026, 3, 10))

const demoAppointments: Ref<Record<string, string[]>> = ref({
  '2026-03-01': ['09:00', '12:30'],
  '2026-03-04': ['10:00', '14:30', '18:00'],
  '2026-03-06': ['08:00'],
  '2026-03-08': ['11:15', '16:45'],
  '2026-03-10': ['09:30', '13:00', '17:30']
})

const getAppointmentsForDay = (day: CalendarDate) => {
  return demoAppointments.value[day.toString()] ?? []
}

function getColorByDate(day: CalendarDate) {
  const dayAppointments = getAppointmentsForDay(day)

  if (dayAppointments.length === 0) {
    return undefined
  }

  return 'success'
}

const handleSubmit = (payload: AppointmentFormPayload) => {
  const dayAppointments = demoAppointments.value[payload.scheduledDate] ?? []

  if (dayAppointments.includes(payload.scheduledTime)) {
    return
  }

  demoAppointments.value[payload.scheduledDate] = [...dayAppointments, payload.scheduledTime].sort((left, right) => left.localeCompare(right))
}
</script>

<template lang="pug">
section(class="py-16")
    UContainer(class="flex flex-col sm:flex-row items-center gap-8 sm:gap-10")
        UCalendar(class="" v-model="modelValue" variant="subtle")
          template(#day="{ day }")
            UChip(:show="!!getColorByDate(day)" :color="getColorByDate(day)" size="2xs") {{ day.day }}
        div
          ul
            li(v-for="appointment in getAppointmentsForDay(modelValue)" :key="appointment") {{ appointment }}
          AppointmentForm(@submit="handleSubmit" :day="modelValue")
</template>
