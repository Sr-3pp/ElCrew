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
    return $fetch<Booking>('/api/bookings', {
      method: 'POST',
      credentials: 'include',
      body: payload,
    })
  }

  return {
    createBooking,
  }
}
