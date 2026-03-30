import { eq } from 'drizzle-orm';
import { tables, useDrizzle } from '~~/server/utils/drizzle';
import { isAdmin } from '~~/server/utils/requireSession';

export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    return createError({ status: 403, statusText: 'Forbidden' });
  }

  const db = useDrizzle();

  const teachers = await db
    .select({
      id: tables.User.id,
      username: tables.User.username,
      email: tables.User.email,
      isTeacher: tables.User.isTeacher,
      name: tables.Profile.name,
      lastName: tables.Profile.lastName,
      dob: tables.Profile.dob,
      contact: tables.Profile.contact,
    })
    .from(tables.User)
    .leftJoin(tables.Profile, eq(tables.Profile.userId, tables.User.id))
    .where(eq(tables.User.isTeacher, true));

  return teachers;
});
