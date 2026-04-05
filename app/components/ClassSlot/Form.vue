<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import type { ClassSlotBatchForm, ClassSlotBatchSubmitPayload } from '~~/types/class-slot'

const props = defineProps<{
  day: CalendarDate
}>()

const emit = defineEmits<{
  submit: [payload: ClassSlotBatchSubmitPayload]
}>()

const { locationOptions } = useClassSlotLocations()

const classSlotSchema = v.object({
  placement: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, 'Placement must be at least 2 characters'),
  ),
  times: v.pipe(
    v.array(v.union([v.null(), v.unknown()])),
    v.check((value) => getValidClassSlotTimes(value).length > 0, 'At least one class time is required'),
  ),
  notes: v.optional(v.string()),
})

const classSlotState = reactive<ClassSlotBatchForm>(createClassSlotBatchFormState())

const selectedDate = computed(() => props.day.toString())
const selectedDateLabel = computed(() => formatClassSlotDate(selectedDate.value))

const resetForm = () => {
  Object.assign(classSlotState, createClassSlotBatchFormState())
}

const addTimeField = () => {
  classSlotState.times.push(null)
}

const removeTimeField = (index: number) => {
  if (classSlotState.times.length === 1) {
    classSlotState.times[0] = null
    return
  }

  classSlotState.times.splice(index, 1)
}

const handleSubmit = (event: FormSubmitEvent<ClassSlotBatchForm>) => {
  const times = getUniqueClassSlotTimes(getValidClassSlotTimes(event.data.times))

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
UForm(:schema="classSlotSchema" :state="classSlotState" @submit="handleSubmit" class="grid grid-cols-1 gap-4 rounded-3xl bg-gradient-to-br from-elevated to-muted p-4 sm:grid-cols-2")
    UFormField(label="Selected day" name="scheduledDate" class="col-span-full")
        UInput(:model-value="selectedDateLabel" readonly)
    UFormField(label="Placement" name="placement")
        USelect(v-model="classSlotState.placement" :items="locationOptions" class="w-full")
    UFormField(label="Class times" name="times" class="col-span-full")
        .space-y-3
            .flex.items-center.gap-3(v-for="(_, index) in classSlotState.times" :key="index")
                UInputTime(v-model="classSlotState.times[index]" class="flex-1")
                UButton(icon="i-lucide-trash-2" color="error" variant="ghost" type="button" @click="removeTimeField(index)")
            UButton(type="button" variant="soft" icon="i-lucide-plus" @click="addTimeField") Add another time
    UFormField(label="Notes" name="notes" class="col-span-full")
        UTextarea(v-model="classSlotState.notes" placeholder="Optional details for the appointment" class="w-full")
    UButton(type="submit" variant="outline" label="Add class slots" trailing-icon="i-lucide-calendar-plus" class="sm:col-start-2 sm:justify-self-end")
</template>
