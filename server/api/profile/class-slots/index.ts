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

    return teacherClassSlots
})
