import { eq, tables, useDrizzle } from '~~/server/utils/drizzle';
import { ensureProfileSchema } from '~~/server/utils/profile-schema';
import { requireTeacherSession } from '~~/server/utils/requireSession';

export default defineEventHandler(async (event) => {
  const session = await requireTeacherSession(event);

  const db = useDrizzle();
  await ensureProfileSchema(db)

  const [teacher] = await db
    .select({
      id: tables.User.id,
      username: tables.User.username,
      email: tables.User.email,
      isTeacher: tables.User.isTeacher,
      name: tables.Profile.name,
      lastName: tables.Profile.lastName,
      dob: tables.Profile.dob,
      picture: tables.Profile.picture,
      quote: tables.Profile.quote,
      bio: tables.Profile.bio,
      favoriteTricks: tables.Profile.favoriteTricks,
      areaOfFocus: tables.Profile.areaOfFocus,
      contact: tables.Profile.contact,
    })
    .from(tables.User)
    .leftJoin(tables.Profile, eq(tables.Profile.userId, tables.User.id))
    .where(eq(tables.User.id, session.user.id))
    .limit(1);

  if (!teacher) {
    throw createError({ status: 404, statusText: 'Teacher not found' });
  }

  return teacher;
});
