<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { Time } from '@internationalized/date'
import type { AvailabilityFormPayload } from '~~/types/availability'

const { teacherId } = defineProps<{
  isAdmin?: boolean
  teacherId: string
}>()

const modelValue = shallowRef(new CalendarDate(2026, 3, 10))

const { saveSchedule } = useSchedule(teacherId)

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

const formatTimeValue = (value: Time) => {
  const hour = String(value.hour).padStart(2, '0')
  const minute = String(value.minute).padStart(2, '0')

  return `${hour}:${minute}`
}

function getColorByDate(day: CalendarDate) {
  const dayAppointments = getAppointmentsForDay(day)

  if (dayAppointments.length === 0) {
    return undefined
  }

  return 'success'
}

const handleSubmit = (payload: AvailabilityFormPayload) => {
  if (!payload.startTime) {
    return
  }

  const startTime = formatTimeValue(payload.startTime)
  const dayAppointments = demoAppointments.value[payload.date] ?? []

  if (dayAppointments.includes(startTime)) {
    return
  }

  saveSchedule(payload)
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
          AvailabilityForm(@submit="handleSubmit" :day="modelValue")
</template>
