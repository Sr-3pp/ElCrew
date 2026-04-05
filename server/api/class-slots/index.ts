export default defineEventHandler(async () => {
  const db = useDrizzle()

  const classSlots = await db.select()
    .from(tables.ClassSlot)
    .where(eq(tables.ClassSlot.status, 'scheduled'))

  return classSlots
})
