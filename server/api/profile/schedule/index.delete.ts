import type { DeleteSchedulePayload } from '~~/types/schedule'

export default defineEventHandler(async (event) => {
    const session = await requireTeacherSession(event);
    const teacherId = session.user.id;

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody<DeleteSchedulePayload>(event)

    const db = useDrizzle()
    await db.delete(tables.Schedule)
            .where(
                and(
                    eq(tables.Schedule.teacherId, teacherId),
                    eq(tables.Schedule.id, body.id)
                )
            )

    return { success: true }
})
