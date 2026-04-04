<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import type { ScheduleForm } from '~~/types/schedule'

const props = defineProps<{
  day: CalendarDate
}>()

const emit = defineEmits<{
  submit: [payload: ScheduleForm]
}>()

const { locationOptions } = useScheduleLocations()

const scheduleSchema = v.object({
  placement: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, 'Placement must be at least 2 characters'),
  ),
  time: v.pipe(
    v.unknown(),
    v.check(hasScheduleTimeValue, 'Class time is required'),
  ),
  durationMinutes: v.pipe(
    v.number(),
    v.minValue(15, 'Duration must be at least 15 minutes'),
  ),
  notes: v.optional(v.string()),
})

const scheduleState = reactive<ScheduleForm>(createScheduleFormState())

const selectedDate = computed(() => props.day.toString())

const resetForm = () => {
  Object.assign(scheduleState, createScheduleFormState())
}

const handleSubmit = (event: FormSubmitEvent<ScheduleForm>) => {
  if (!event.data.time) {
    return
  }

  emit('submit', {
    placement: event.data.placement.trim(),
    date: selectedDate.value,
    time: event.data.time,
    durationMinutes: event.data.durationMinutes,
    notes: event.data.notes.trim(),
  })

  resetForm()
}
</script>

<template lang="pug">
UForm(:schema="scheduleSchema" :state="scheduleState" @submit="handleSubmit" class="grid grid-cols-1 gap-4 rounded-3xl bg-gradient-to-br from-elevated to-muted p-4 sm:grid-cols-2")
    UFormField(label="Selected day" name="scheduledDate" class="col-span-full")
        UInput(:model-value="selectedDate" readonly)
    UFormField(label="Placement" name="placement")
        USelect(v-model="scheduleState.placement" :items="locationOptions" class="w-full")
    UFormField(label="Class time" name="time")
        UInputTime(v-model="scheduleState.time" class="w-full")
    UFormField(label="Duration (minutes)" name="durationMinutes")
        UInput(v-model.number="scheduleState.durationMinutes" type="number" min="15" step="15" class="w-full")
    UFormField(label="Notes" name="notes" class="col-span-full")
        UTextarea(v-model="scheduleState.notes" placeholder="Optional details for the appointment" class="w-full")
    UButton(type="submit" variant="outline" label="Schedule a class" trailing-icon="i-lucide-calendar-plus" class="sm:col-start-2 sm:justify-self-end")
</template>
