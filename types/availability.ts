import type { Time } from '@internationalized/date'

export type AvailabilityFormState = {
    placement: string;
    startTime: Time | undefined;
    durationMinutes: number;
    notes: string;
};

export type AvailabilityFormPayload = {
    placement: string;
    date: string;
    startTime: Time | undefined;
    endTime: Time | undefined;
    notes?: string;
};