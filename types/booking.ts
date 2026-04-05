export type Booking = typeof import('~~/server/models/Booking').Booking.$inferSelect;
export type NewBooking = typeof import('~~/server/models/Booking').Booking.$inferInsert;

export type BookingPayload = Pick<NewBooking, 'classSlotId' | 'studentId' | 'notes'>;

export type BookingFormState = {
  classSlotId: string
  name: string
  lastName: string
  dob: string
  notes: string
}

export type CreateBookingPayload = {
  classSlotId: string
  name: string
  lastName: string
  dob: string
  notes?: string
}

export type BookingFormSchema = CreateBookingPayload & {
  notes: string
}
