<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { Time } from '@internationalized/date'
import type { ScheduleForm } from '~~/types/schedule'

const { teacherId } = defineProps<{
  isAdmin?: boolean
  teacherId: string
}>()

const modelValue = shallowRef(new CalendarDate(2026, 3, 10))

const { saveSchedule, getSchedule, deleteSchedule } = useSchedule(teacherId)

const { data: schedule, refresh: refreshSchedule } = await useAsyncData('schedule', () => getSchedule())

const scheduleDates = computed<Record<string, string[]>>(() => {
  if (!schedule.value) {
    return {}
  }

  return schedule.value.reduce<Record<string, string[]>>((appointmentsByDate, item) => {
    const [year, month, day] = item.scheduledDate.split('-').map(Number)
    const key = `${year?.toString()}-${month?.toString().padStart(2, '0')}-${day?.toString().padStart(2, '0')}`

    if (appointmentsByDate[key]) {
      appointmentsByDate[key]!.push(item.scheduledTime)
    } else {
      appointmentsByDate[key] = [item.scheduledTime]
    }

    return appointmentsByDate
  }, {})
})

const getAppointmentsForDay = (day: CalendarDate) => {
  return scheduleDates.value[day.toString()] ?? []
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

const handleSubmit = (payload: ScheduleForm) => {
  if (!payload.time) {
    return
  }

  const startTime = formatTimeValue(payload.time)
  const dayAppointments = scheduleDates.value[payload.date] ?? []

  if (dayAppointments.includes(startTime)) {
    return
  }

  saveSchedule(payload)
}

const handleDelete = async (payload: { date: string, time: string }) => {
  await deleteSchedule(payload)
  await refreshSchedule()
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
            li(v-for="appointment in scheduleDates" :key="appointment")
              span {{ appointment }}
              UButton(@click="handleDelete({ date: modelValue.toString(), time: appointment })" size="xs" color="error" icon="i-lucide-trash" class="ml-2")
          ScheduleForm(@submit="handleSubmit" :day="modelValue")
</template>
