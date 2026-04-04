export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ status: 400, statusText: 'Teacher id is required' });
  }

  const db = useDrizzle();

  const [classSlot] = await db
    .select({ id: tables.ClassSlot.id })
    .from(tables.ClassSlot)
    .where(eq(tables.ClassSlot.teacherId, id))
    .limit(1);

  if (classSlot) {
    throw createError({
      status: 400,
      statusText: 'Teacher has class slots and cannot be deleted',
    });
  }

  await db
    .update(tables.Student)
    .set({ teacherId: null })
    .where(eq(tables.Student.teacherId, id));

  await db
    .delete(tables.Profile)
    .where(eq(tables.Profile.userId, id));

  const [user] = await db
    .delete(tables.User)
    .where(eq(tables.User.id, id))
    .returning();

  if (!user) {
    throw createError({ status: 404, statusText: 'Teacher not found' });
  }

  return { id: user.id };
});
