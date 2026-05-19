import type { CreateClassSlotPayload } from '~~/types/class-slot'

const toScheduledTimeString = (value: CreateClassSlotPayload['time']) => {
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

    const body = await readBody<CreateClassSlotPayload>(event)

    const db = useDrizzle()
    const [newClassSlot] = await db.insert(tables.ClassSlot).values({
        teacherId,
        placement: body.placement,
        scheduledDate: body.date,
        scheduledTime: toScheduledTimeString(body.time),
        notes: body.notes,
    }).returning()

    return newClassSlot
})
