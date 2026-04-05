import { inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const session = await requireTeacherSession(event);
    const teacherId = session.user.id;

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const db = useDrizzle()
    const teacherClassSlots = await db.select()
                                        .from(tables.ClassSlot)
                                        .where(eq(tables.ClassSlot.teacherId, teacherId))

    const classSlotIds = teacherClassSlots.map(classSlot => classSlot.id)

    if (classSlotIds.length === 0) {
        return []
    }

    const bookings = await db.select({
                            bookingId: tables.Booking.id,
                            classSlotId: tables.Booking.classSlotId,
                            studentId: tables.Booking.studentId,
                            status: tables.Booking.status,
                            notes: tables.Booking.notes,
                            name: tables.Student.name,
                            lastName: tables.Student.lastName,
                            dob: tables.Student.dob,
                        })
                        .from(tables.Booking)
                        .innerJoin(tables.Student, eq(tables.Student.id, tables.Booking.studentId))
                        .where(inArray(tables.Booking.classSlotId, classSlotIds))

    const attendeesByClassSlotId = bookings.reduce<Record<string, typeof bookings>>((acc, booking) => {
        const currentBookings = acc[booking.classSlotId] ?? []
        currentBookings.push(booking)
        acc[booking.classSlotId] = currentBookings
        return acc
    }, {})

    return teacherClassSlots.map((classSlot) => ({
        ...classSlot,
        attendees: (attendeesByClassSlotId[classSlot.id] ?? []).map(attendee => ({
            bookingId: attendee.bookingId,
            studentId: attendee.studentId,
            name: attendee.name,
            lastName: attendee.lastName,
            dob: attendee.dob,
            status: attendee.status,
            notes: attendee.notes,
        })),
    }))
})
