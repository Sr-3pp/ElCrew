import { eq } from 'drizzle-orm';
export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  const db = useDrizzle();
  await ensureProfileSchema(db)

  const teachers = await db
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
    .where(eq(tables.User.isTeacher, true));

  return teachers;
});
