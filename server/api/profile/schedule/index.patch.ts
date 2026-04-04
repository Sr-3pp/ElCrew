
import type { UpdateSchedulePayload } from '~~/types/schedule'

export default defineEventHandler(async (event) => {
    const session = await requireTeacherSession(event);
    const teacherId = session.user.id;

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody<UpdateSchedulePayload>(event)

    const db = useDrizzle()
    await db.update(tables.Schedule)
            .set({ scheduledTime: body.time })
            .where(
                and(
                    eq(tables.Schedule.id, body.id),
                    eq(tables.Schedule.teacherId, teacherId)
                )
            )

    return { success: true }
})
