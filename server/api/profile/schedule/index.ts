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
    const teacherAppointments = await db.select()
                                        .from(tables.Schedule)
                                        .where(eq(tables.Schedule.teacherId, teacherId))

    return teacherAppointments
})