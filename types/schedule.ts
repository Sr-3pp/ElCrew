import type { Time } from '@internationalized/date'

export type ScheduleForm = {
  placement: string
  date: string
  time: Time | null
  durationMinutes: number
  notes: string
}

export type ScheduleItem = {
  id: string
  teacherId: string
  placement: string
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
  notes: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export type ScheduleDay = {
  date: string
  placement: string
  appointments: ScheduleItem[]
}

export type ScheduleByDate = Record<string, ScheduleDay>

export type ScheduleLocationOption = {
  label: string
  value: string
}

export type CreateSchedulePayload = ScheduleForm

export type UpdateSchedulePayload = {
  id: string
  time: string
}

export type DeleteSchedulePayload = {
  id: string
}

export type ScheduleMutationResult = {
  success: boolean
}
