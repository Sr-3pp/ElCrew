export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const db = useDrizzle();

  const students = await db.select().from(tables.Student);

  return students;
})
