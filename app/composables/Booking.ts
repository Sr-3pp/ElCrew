import type { Booking, BookingFormState, CreateBookingPayload } from '~~/types/booking'

export const createBookingFormState = (): BookingFormState => ({
  classSlotId: '',
  name: '',
  lastName: '',
  dob: '',
  notes: '',
})

export const useBookings = () => {
  const createBooking = async (payload: CreateBookingPayload) => {
    return apiFetch<Booking>('/api/bookings', {
      method: 'POST',
      body: payload,
    })
  }

  return {
    createBooking,
  }
}
