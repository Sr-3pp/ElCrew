import type { UpdateClassSlotPayload } from '~~/types/class-slot'

export default defineEventHandler(async (event) => {
    const session = await requireTeacherSession(event);
    const teacherId = session.user.id;

    const body = await readBody<UpdateClassSlotPayload>(event)

    const db = useDrizzle()
    await db.update(tables.ClassSlot)
            .set({ scheduledTime: body.time })
            .where(
                and(
                    eq(tables.ClassSlot.id, body.id),
                    eq(tables.ClassSlot.teacherId, teacherId)
                )
            )

    return { success: true }
})
