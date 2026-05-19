export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ status: 400, statusText: 'Student id is required' });
  }

  const db = useDrizzle();

  const [student] = await db
    .delete(tables.Student)
    .where(eq(tables.Student.id, id))
    .returning();

  if (!student) {
    throw createError({ status: 404, statusText: 'Student not found' });
  }

  return student;
});
