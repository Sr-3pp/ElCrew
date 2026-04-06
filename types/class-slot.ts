import type { Time } from '@internationalized/date'

export type ClassSlotForm = {
  placement: string
  date: string
  time: Time | null
  notes: string
}

export type ClassSlotBatchForm = {
  placement: string
  date: string
  times: Array<Time | null>
  notes: string
}

export type ClassSlotBatchSubmitPayload = {
  placement: string
  date: string
  times: Time[]
  notes: string
}

export type ClassSlotItem = {
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

export type ClassSlotAttendee = {
  bookingId: string
  studentId: string
  name: string
  lastName: string
  dob: string
  status: string
  notes: string | null
}

export type TeacherClassSlotItem = ClassSlotItem & {
  attendees: ClassSlotAttendee[]
}

export type PublicClassSlotItem = ClassSlotItem

export type ClassSlotDay = {
  date: string
  placement: string
  appointments: ClassSlotItem[]
}

export type ClassSlotByDate = Record<string, ClassSlotDay>

export type ClassSlotDayGroup<T extends ClassSlotItem = ClassSlotItem> = Omit<ClassSlotDay, 'appointments'> & {
  appointments: T[]
}

export type ClassSlotLocationOption = {
  label: string
  value: string
}

export type CreateClassSlotPayload = ClassSlotForm

export type UpdateClassSlotPayload = {
  id: string
  time: string
}

export type DeleteClassSlotPayload = {
  id: string
}

export type ClassSlotMutationResult = {
  success: boolean
}
