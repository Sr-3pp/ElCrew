import type { CreateBookingPayload } from '~~/types/booking'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateBookingPayload>(event)

  const classSlotId = body.classSlotId?.trim()
  const name = body.name?.trim()
  const lastName = body.lastName?.trim()
  const dob = body.dob?.trim()

  if (!classSlotId || !name || !lastName || !dob) {
    throw createError({
      status: 400,
      statusText: 'Class slot, name, last name, and birth date are required',
    })
  }

  const db = useDrizzle()

  const [classSlot] = await db
    .select()
    .from(tables.ClassSlot)
    .where(eq(tables.ClassSlot.id, classSlotId))
    .limit(1)

  if (!classSlot) {
    throw createError({
      status: 404,
      statusText: 'Class slot not found',
    })
  }

  const [existingStudent] = await db
    .select()
    .from(tables.Student)
    .where(
      and(
        eq(tables.Student.name, name),
        eq(tables.Student.lastName, lastName),
        eq(tables.Student.dob, dob),
      ),
    )
    .limit(1)

  const [student] = existingStudent
    ? [existingStudent]
    : await db
        .insert(tables.Student)
        .values({
          name,
          lastName,
          dob,
          contact: null,
          teacherId: classSlot.teacherId,
        })
        .returning()

  if (!student) {
    throw createError({
      status: 500,
      statusText: 'Student could not be created',
    })
  }

  const [existingBooking] = await db
    .select()
    .from(tables.Booking)
    .where(
      and(
        eq(tables.Booking.classSlotId, classSlot.id),
        eq(tables.Booking.studentId, student.id),
      ),
    )
    .limit(1)

  if (existingBooking) {
    throw createError({
      status: 409,
      statusText: 'You are already registered for this class',
    })
  }

  const [booking] = await db
    .insert(tables.Booking)
    .values({
      classSlotId: classSlot.id,
      studentId: student.id,
      notes: body.notes?.trim() || null,
    })
    .returning()

  return booking
})
