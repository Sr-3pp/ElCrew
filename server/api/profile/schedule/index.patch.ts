
export default defineEventHandler(async (event) => {
    const session = await requireTeacherSession(event);
    const teacherId = session.user.id;

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody<{ id: string, time: string }>(event)

    console.log('Updating schedule with id:', body.id, 'to new time:', body.time)

    const db = useDrizzle()
    await db.delete(tables.Schedule)
            .where(
                and(
                    eq(tables.Schedule.id, body.id)
                )
            )

    return { success: true }
})