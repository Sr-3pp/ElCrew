<script setup lang="ts">
import { Time } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import type { AvailabilityFormPayload, AvailabilityFormState } from '~~/types/availability'

const props = defineProps<{
    day: CalendarDate;
}>()

const {data: locatinos} = await useAsyncData('locations', () => queryCollection('config').where('stem', 'LIKE', '%locations%').all())

const locationOptions = computed(() => {
    return locatinos.value
        ? locatinos.value.map(location => ({
            label: location.meta.name,
            value: location.meta.name,
        }))
        : []
})

const emit = defineEmits<{
    submit: [payload: AvailabilityFormPayload];
}>()

const hasTimeValue = (value: unknown): value is Time => {
    return typeof value === 'object' && value !== null && 'hour' in value && 'minute' in value
}

const addMinutesToTime = (value: Time, minutesToAdd: number) => {
    const totalMinutes = (value.hour * 60) + value.minute + minutesToAdd
    const normalizedMinutes = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60)

    return new Time(
        Math.floor(normalizedMinutes / 60),
        normalizedMinutes % 60,
    )
}

const availabilitySchema = v.object({
    placement: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(2, 'Placement must be at least 2 characters')
    ),
    startTime: v.pipe(
        v.unknown(),
        v.check(hasTimeValue, 'Start time is required')
    ),
    durationMinutes: v.pipe(
        v.number(),
        v.minValue(15, 'Duration must be at least 15 minutes')
    ),
    notes: v.optional(v.string())
})

const availabilityState = reactive<AvailabilityFormState>({
    placement: '',
    startTime: undefined,
    durationMinutes: 60,
    notes: '',
})

const selectedDate = computed(() => props.day.toString())

const handleSubmit = (event: FormSubmitEvent<AvailabilityFormState>) => {
    if (!event.data.startTime) {
        return
    }

    const endTime = addMinutesToTime(event.data.startTime, event.data.durationMinutes)

    emit('submit', {
        placement: event.data.placement.trim(),
        date: selectedDate.value,
        startTime: event.data.startTime,
        endTime,
        notes: event.data.notes.trim() || undefined,
    })

    availabilityState.placement = ''
    availabilityState.startTime = undefined
    availabilityState.durationMinutes = 60
    availabilityState.notes = ''
}
</script>

<template lang="pug">
UForm(:schema="availabilitySchema" :state="availabilityState" @submit="handleSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl bg-gradient-to-br from-elevated to-muted p-4")
    UFormField(label="Selected day" name="scheduledDate" class="col-span-full")
        UInput(:model-value="selectedDate" readonly)
    UFormField(label="Placement" name="placement")
        USelect(v-model="availabilityState.placement" :items="locationOptions" class="w-full")
    UFormField(label="Class time" name="startTime")
        UInputTime(v-model="availabilityState.startTime" class="w-full")
    UFormField(label="Duration (minutes)" name="durationMinutes")
        UInput(v-model.number="availabilityState.durationMinutes" type="number" min="15" step="15" class="w-full")
    UFormField(label="Notes" name="notes" class="col-span-full")
        UTextarea(v-model="availabilityState.notes" placeholder="Optional details for the appointment" class="w-full")
    UButton(type="submit" variant="outline" label="Schedule a class" trailing-icon="i-lucide-calendar-plus" class="sm:col-start-2 sm:justify-self-end")
</template>