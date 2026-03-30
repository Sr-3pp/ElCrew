import { eq, tables, useDrizzle } from '~~/server/utils/drizzle';
import { isAdmin } from '~~/server/utils/requireSession';
import type { TeacherPayload } from '~~/types/teacher';

export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  const id = getRouterParam(event, 'id');
  const teacherPayload = await readBody<TeacherPayload>(event);

  const username = teacherPayload?.username?.trim();
  const email = teacherPayload?.email?.trim();
  const name = teacherPayload?.name?.trim();
  const lastName = teacherPayload?.lastName?.trim();
  const dob = teacherPayload?.dob?.trim();
  const contact = teacherPayload?.contact?.trim() || null;

  if (!id || !username || !email || !name || !lastName || !dob) {
    throw createError({
      status: 400,
      statusText: 'id, username, email, name, lastName, and dob are required',
    });
  }

  const db = useDrizzle();

  const [user] = await db
    .update(tables.User)
    .set({
      username,
      email,
      isTeacher: true,
    })
    .where(eq(tables.User.id, id))
    .returning();

  if (!user) {
    throw createError({ status: 404, statusText: 'Teacher not found' });
  }

  const [existingProfile] = await db
    .select()
    .from(tables.Profile)
    .where(eq(tables.Profile.userId, id))
    .limit(1);

  const [profile] = existingProfile
    ? await db
        .update(tables.Profile)
        .set({
          name,
          lastName,
          dob,
          contact,
        })
        .where(eq(tables.Profile.userId, id))
        .returning()
    : await db
        .insert(tables.Profile)
        .values({
          id: crypto.randomUUID(),
          userId: id,
          name,
          lastName,
          dob,
          contact,
        })
        .returning();

  if (!profile) {
    throw createError({ status: 500, statusText: 'Teacher profile could not be updated' });
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isTeacher: true,
    name: profile.name,
    lastName: profile.lastName,
    dob: profile.dob,
    contact: profile.contact,
  };
});
