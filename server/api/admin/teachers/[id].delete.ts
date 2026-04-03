export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ status: 400, statusText: 'Teacher id is required' });
  }

  const db = useDrizzle();

  const [appointment] = await db
    .select({ id: tables.Appointment.id })
    .from(tables.Appointment)
    .where(eq(tables.Appointment.teacherId, id))
    .limit(1);

  if (appointment) {
    throw createError({
      status: 400,
      statusText: 'Teacher has scheduled appointments and cannot be deleted',
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
