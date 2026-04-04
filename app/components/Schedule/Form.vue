<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import type { ScheduleBatchForm, ScheduleBatchSubmitPayload } from '~~/types/schedule'

const props = defineProps<{
  day: CalendarDate
}>()

const emit = defineEmits<{
  submit: [payload: ScheduleBatchSubmitPayload]
}>()

const { locationOptions } = useScheduleLocations()

const scheduleSchema = v.object({
  placement: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, 'Placement must be at least 2 characters'),
  ),
  times: v.pipe(
    v.array(v.union([v.null(), v.unknown()])),
    v.check((value) => getValidScheduleTimes(value).length > 0, 'At least one class time is required'),
  ),
  notes: v.optional(v.string()),
})

const scheduleState = reactive<ScheduleBatchForm>(createScheduleBatchFormState())

const selectedDate = computed(() => props.day.toString())
const selectedDateLabel = computed(() => formatScheduleDate(selectedDate.value))

const resetForm = () => {
  Object.assign(scheduleState, createScheduleBatchFormState())
}

const addTimeField = () => {
  scheduleState.times.push(null)
}

const removeTimeField = (index: number) => {
  if (scheduleState.times.length === 1) {
    scheduleState.times[0] = null
    return
  }

  scheduleState.times.splice(index, 1)
}

const handleSubmit = (event: FormSubmitEvent<ScheduleBatchForm>) => {
  const times = getUniqueScheduleTimes(getValidScheduleTimes(event.data.times))

  if (times.length === 0) {
    return
  }

  emit('submit', {
    placement: event.data.placement.trim(),
    date: selectedDate.value,
    times,
    notes: event.data.notes.trim(),
  })

  resetForm()
}
</script>

<template lang="pug">
UForm(:schema="scheduleSchema" :state="scheduleState" @submit="handleSubmit" class="grid grid-cols-1 gap-4 rounded-3xl bg-gradient-to-br from-elevated to-muted p-4 sm:grid-cols-2")
    UFormField(label="Selected day" name="scheduledDate" class="col-span-full")
        UInput(:model-value="selectedDateLabel" readonly)
    UFormField(label="Placement" name="placement")
        USelect(v-model="scheduleState.placement" :items="locationOptions" class="w-full")
    UFormField(label="Class times" name="times" class="col-span-full")
        .space-y-3
            .flex.items-center.gap-3(v-for="(_, index) in scheduleState.times" :key="index")
                UInputTime(v-model="scheduleState.times[index]" class="flex-1")
                UButton(icon="i-lucide-trash-2" color="error" variant="ghost" type="button" @click="removeTimeField(index)")
            UButton(type="button" variant="soft" icon="i-lucide-plus" @click="addTimeField") Add another time
    UFormField(label="Notes" name="notes" class="col-span-full")
        UTextarea(v-model="scheduleState.notes" placeholder="Optional details for the appointment" class="w-full")
    UButton(type="submit" variant="outline" label="Schedule a class" trailing-icon="i-lucide-calendar-plus" class="sm:col-start-2 sm:justify-self-end")
</template>
