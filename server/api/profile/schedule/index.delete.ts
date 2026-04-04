export default defineEventHandler(async (event) => {
    const session = await requireTeacherSession(event);
    const teacherId = session.user.id;

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody<{ date: string, time: string }>(event)

    const db = useDrizzle()
    await db.delete(tables.Schedule)
            .where(
                and(
                    eq(tables.Schedule.teacherId, teacherId),
                    eq(tables.Schedule.scheduledDate, body.date),
                    eq(tables.Schedule.scheduledTime, body.time)
                )
            )

    return { success: true }
})