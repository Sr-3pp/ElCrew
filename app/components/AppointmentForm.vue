<script setup lang="ts">
import type { CalendarDate, Time } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as v from 'valibot'
import type { AppointmentFormPayload, AppointmentFormState } from '~~/types/appointment'

const props = defineProps<{
    day: CalendarDate;
}>()

const emit = defineEmits<{
    submit: [payload: AppointmentFormPayload];
}>()

const hasTimeValue = (value: unknown): value is Time => {
    return typeof value === 'object' && value !== null && 'hour' in value && 'minute' in value
}

const formatTimeValue = (value: Time) => {
    const hour = String(value.hour).padStart(2, '0')
    const minute = String(value.minute).padStart(2, '0')

    return `${hour}:${minute}`
}

const appointmentSchema = v.object({
    studentName: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(2, 'Student name must be at least 2 characters')
    ),
    placement: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(2, 'Placement must be at least 2 characters')
    ),
    classTime: v.pipe(
        v.unknown(),
        v.check(hasTimeValue, 'Class time is required')
    ),
    durationMinutes: v.pipe(
        v.number(),
        v.minValue(15, 'Duration must be at least 15 minutes')
    ),
    notes: v.optional(v.string())
})

const appointmentState = reactive<AppointmentFormState>({
    studentName: '',
    placement: '',
    classTime: undefined,
    durationMinutes: 60,
    notes: '',
})

const selectedDate = computed(() => props.day.toString())

const handleSubmit = (event: FormSubmitEvent<AppointmentFormState>) => {
    if (!event.data.classTime) {
        return
    }

    emit('submit', {
        studentName: event.data.studentName.trim(),
        placement: event.data.placement.trim(),
        scheduledDate: selectedDate.value,
        scheduledTime: formatTimeValue(event.data.classTime),
        durationMinutes: event.data.durationMinutes,
        notes: event.data.notes.trim() || undefined,
    })

    appointmentState.studentName = ''
    appointmentState.placement = ''
    appointmentState.classTime = undefined
    appointmentState.durationMinutes = 60
    appointmentState.notes = ''
}
</script>

<template lang="pug">
UForm(:schema="appointmentSchema" :state="appointmentState" @submit="handleSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-3xl bg-gradient-to-br from-elevated to-muted p-4")
    UFormField(label="Selected day" name="scheduledDate" class="col-span-full")
        UInput(:model-value="selectedDate" readonly)
    UFormField(label="Student name" name="studentName")
        UInput(v-model="appointmentState.studentName" placeholder="Student full name" class="w-full")
    UFormField(label="Placement" name="placement")
        UInput(v-model="appointmentState.placement" placeholder="Studio A" class="w-full")
    UFormField(label="Class time" name="classTime")
        UInputTime(v-model="appointmentState.classTime" class="w-full")
    UFormField(label="Duration (minutes)" name="durationMinutes")
        UInput(v-model.number="appointmentState.durationMinutes" type="number" min="15" step="15" class="w-full")
    UFormField(label="Notes" name="notes" class="col-span-full")
        UTextarea(v-model="appointmentState.notes" placeholder="Optional details for the appointment" class="w-full")
    UButton(type="submit" variant="outline" label="Schedule a class" trailing-icon="i-lucide-calendar-plus" class="sm:col-start-2 sm:justify-self-end")
</template>