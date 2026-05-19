export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id');
  const {
    username,
    email,
    name,
    lastName,
    dob,
    quote,
    bio,
    favoriteTricks,
    areaOfFocus,
    contact,
    pictureFile,
  } = await readTeacherForm(event);

  if (!id || !username || !email || !name || !lastName || !dob) {
    throw createError({
      status: 400,
      statusText: 'id, username, email, name, lastName, and dob are required',
    });
  }

  const db = useDrizzle();
  await ensureProfileSchema(db)

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

  const picture = pictureFile
    ? await uploadTeacherPicture(id, pictureFile)
    : existingProfile?.picture || null;

  const [profile] = existingProfile
    ? await db
        .update(tables.Profile)
        .set({
          name,
          lastName,
          dob,
          picture,
          quote,
          bio,
          favoriteTricks,
          areaOfFocus,
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
          picture,
          quote,
          bio,
          favoriteTricks,
          areaOfFocus,
          contact,
        })
        .returning();

  if (!profile) {
    throw createError({ status: 500, statusText: 'Teacher profile could not be updated' });
  }

  if (pictureFile && existingProfile?.picture && existingProfile.picture !== picture) {
    await deleteTeacherPicture(existingProfile.picture)
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isTeacher: true,
    name: profile.name,
    lastName: profile.lastName,
    dob: profile.dob,
    picture: profile.picture,
    quote: profile.quote,
    bio: profile.bio,
    favoriteTricks: profile.favoriteTricks,
    areaOfFocus: profile.areaOfFocus,
    contact: profile.contact,
  };
});
