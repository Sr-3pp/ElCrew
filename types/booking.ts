export type Booking = typeof import('~~/server/models/Booking').Booking.$inferSelect;
export type NewBooking = typeof import('~~/server/models/Booking').Booking.$inferInsert;

export type BookingPayload = Pick<NewBooking, 'classSlotId' | 'studentId' | 'notes'>;
