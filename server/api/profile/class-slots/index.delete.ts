import type { DeleteClassSlotPayload } from '~~/types/class-slot'

export default defineEventHandler(async (event) => {
    const session = await requireTeacherSession(event);
    const teacherId = session.user.id;

    const body = await readBody<DeleteClassSlotPayload>(event)

    const db = useDrizzle()
    await db.delete(tables.ClassSlot)
            .where(
                and(
                    eq(tables.ClassSlot.teacherId, teacherId),
                    eq(tables.ClassSlot.id, body.id)
                )
            )

    return { success: true }
})
