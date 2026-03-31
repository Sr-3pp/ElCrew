import type { Time } from '@internationalized/date'

export type AppointmentFormState = {
    studentName: string;
    placement: string;
    classTime: Time | undefined;
    durationMinutes: number;
    notes: string;
};

export type AppointmentFormPayload = {
    studentName: string;
    placement: string;
    scheduledDate: string;
    scheduledTime: string;
    durationMinutes: number;
    notes?: string;
};