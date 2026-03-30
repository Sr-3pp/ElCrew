<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const value = ref([
  new CalendarDate(2026, 3, 4),
  new CalendarDate(2026, 3, 6),
  new CalendarDate(2026, 3, 8)
])

const demoAppointments: Record<string, string[]> = {
  '2026-03-01': ['09:00', '12:30'],
  '2026-03-04': ['10:00', '14:30', '18:00'],
  '2026-03-06': ['08:00'],
  '2026-03-08': ['11:15', '16:45'],
  '2026-03-12': ['09:30', '13:00', '17:30']
}

const getAppointmentsForDay = (day: CalendarDate) => {
  return demoAppointments[day.toString()] ?? []
}

const calendarUi = {
  cell: 'h-24 w-24 align-top',
  cellTrigger: '!h-full !w-full !rounded-md !whitespace-normal !items-start !justify-start !p-1'
}

const updateAvailability = () => {
  console.log('Selected dates:', value.value)
  // Here you would typically send the selected dates to your backend to update the teacher's availability
}
</script>

<template lang="pug">
section(class="py-16")
    UContainer(class="flex flex-col sm:flex-row items-center gap-8 sm:gap-10")
        UCalendar(class="" multiple v-model="value" variant="subtle" :ui="calendarUi")
            template(#day="{ day }")
                div.flex.h-full.w-full.flex-col.items-start.gap-1.rounded-md.p-1
                    span.self-center.text-sm.font-medium {{ day.day }}
                    template(v-if="getAppointmentsForDay(day).length")
                        UBadge(v-for="time in getAppointmentsForDay(day)" :key="`${day.toString()}-${time}`" :label="time" size="sm" color="secondary")
        UButton(variant="outline" label="Schedule a class" trailing-icon="i-lucide-calendar-plus" @click="updateAvailability")
</template>
