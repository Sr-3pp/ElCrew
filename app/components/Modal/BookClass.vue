<script setup lang="ts">
import { CalendarDate } from '@internationalized/date';

const { isOpen } = useModal('book')

const availableDateTimes = ref([
  {
    date: '2024-07-01',
    startTime: '10:00',
    endTime: '18:00',
  },
    {
        date: '2024-07-02',
        startTime: '10:00',
        endTime: '18:00',
  }
])

const normalizeDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)
  return new CalendarDate(Number(year), Number(month), Number(day))
}

const calendarDates = computed(() => availableDateTimes.value.map(dt => normalizeDate(dt.date)))

</script>

<template lang="pug">
UDrawer(v-model:open="isOpen")
    template(#body)
        UCalendar(v-model="calendarDates" variant="subtle")

</template>