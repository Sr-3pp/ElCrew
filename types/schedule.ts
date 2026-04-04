import type { Time } from '@internationalized/date'

export type ScheduleForm = {
    placement: string;
    date: string;
    time: Time | null;
    durationMinutes: number;
    notes: string;
};
