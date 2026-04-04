<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import type { ScheduleForm, ScheduleItem } from '~~/types/schedule'

const { teacherId } = defineProps<{
  isAdmin?: boolean
  teacherId: string
}>()

const selectedDate = shallowRef(today(getLocalTimeZone()))
const { getLocationLabel } = useScheduleLocations()

const {
  saveSchedule,
  deleteSchedule,
  useScheduleData,
} = useSchedule(teacherId)

const { data: schedule, refresh: refreshSchedule, pending: isLoadingSchedule } = await useScheduleData()

const {
  currentDaySchedule,
  hasAppointmentsOnDay,
  isTimeBooked,
} = useScheduleCalendar(schedule, selectedDate)

const selectedDateLabel = computed(() => formatScheduleDate(selectedDate.value.toString()))
const currentPlacementLabel = computed(() => {
  return currentDaySchedule.value.placement
    ? getLocationLabel(currentDaySchedule.value.placement)
    : 'No location selected for this day yet.'
})

const getDayColor = (day: CalendarDate) => {
  return hasAppointmentsOnDay(day) ? 'success' : undefined
}

const handleSubmit = async (payload: ScheduleForm) => {
  if (!payload.time) {
    return
  }

  const formattedTime = formatScheduleTime(payload.time)
  if (isTimeBooked(payload.date, formattedTime)) {
    return
  }

  await saveSchedule(payload)
  await refreshSchedule()
}

const handleDelete = async (appointment: ScheduleItem) => {
  await deleteSchedule({ id: appointment.id })
  await refreshSchedule()
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
            UCard(v-if="currentDaySchedule.appointments.length" variant="soft")
                template(#header)
                    h3(class="text-lg font-semibold") Scheduled classes
                ul(class="space-y-3")
                    li(v-for="appointment in currentDaySchedule.appointments" :key="appointment.id" class="flex items-start justify-between gap-4 rounded-2xl bg-default p-4")
                        div(class="space-y-1")
                            p(class="font-medium") {{ appointment.scheduledTime }}
                            p(class="text-sm text-muted") {{ appointment.durationMinutes }} minutes
                            p(v-if="appointment.notes" class="text-sm text-muted") {{ appointment.notes }}
                        UButton(icon="i-lucide-trash-2" color="error" variant="ghost" @click="handleDelete(appointment)")
            UCard(v-else variant="soft")
                p(class="text-sm text-muted") No classes scheduled for this day.
            ScheduleForm(:day="selectedDate" @submit="handleSubmit")
            p(v-if="isLoadingSchedule" class="text-sm text-muted") Loading schedule...
</template>
