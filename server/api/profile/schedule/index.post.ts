import type { CreateSchedulePayload } from '~~/types/schedule'

const toScheduledTimeString = (value: CreateSchedulePayload['time']) => {
    if (!value) {
        return '00:00'
    }

    const hour = String(value.hour).padStart(2, '0')
    const minute = String(value.minute).padStart(2, '0')

    return `${hour}:${minute}`
}

export default defineEventHandler(async (event) => {
    const session = await requireTeacherSession(event);
    const teacherId = session.user.id;

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody<CreateSchedulePayload>(event)

    const db = useDrizzle()
    const [newSchedule] = await db.insert(tables.Schedule).values({
        teacherId,
        placement: body.placement,
        scheduledDate: body.date,
        scheduledTime: toScheduledTimeString(body.time),
        durationMinutes: body.durationMinutes,
        notes: body.notes,
    }).returning()

    return newSchedule
})
