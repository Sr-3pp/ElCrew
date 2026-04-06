import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')

  if (!username) {
    throw createError({
      status: 400,
      statusText: 'username is required',
    })
  }

  const db = useDrizzle()
  await ensureProfileSchema(db)

  const [teacher] = await db
    .select({
      id: tables.User.id,
      username: tables.User.username,
      email: tables.User.email,
      isTeacher: tables.User.isTeacher,
      createdAt: tables.User.createdAt,
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
    .where(and(
      eq(tables.User.username, username),
      eq(tables.User.isTeacher, true),
    ))
    .limit(1)

  if (!teacher) {
    throw createError({
      status: 404,
      statusText: 'Teacher not found',
    })
  }

  return teacher
})
