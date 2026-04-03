import { eq, tables, useDrizzle } from '~~/server/utils/drizzle';
import { ensureProfileSchema } from '~~/server/utils/profile-schema';
import { requireTeacherSession } from '~~/server/utils/requireSession';
import { deleteTeacherPicture, readTeacherForm, uploadTeacherPicture } from '~~/server/utils/teacher-form';

export default defineEventHandler(async (event) => {
  const session = await requireTeacherSession(event);

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

  if (!username || !email || !name || !lastName || !dob) {
    throw createError({
      status: 400,
      statusText: 'username, email, name, lastName, and dob are required',
    });
  }

  const db = useDrizzle();
  await ensureProfileSchema(db)
  const userId = session.user.id;

  const [user] = await db
    .update(tables.User)
    .set({
      username,
      email,
      isTeacher: true,
    })
    .where(eq(tables.User.id, userId))
    .returning();

  if (!user) {
    throw createError({ status: 404, statusText: 'Teacher not found' });
  }

  const [existingProfile] = await db
    .select()
    .from(tables.Profile)
    .where(eq(tables.Profile.userId, userId))
    .limit(1);

  const picture = pictureFile
    ? await uploadTeacherPicture(userId, pictureFile)
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
        .where(eq(tables.Profile.userId, userId))
        .returning()
    : await db
        .insert(tables.Profile)
        .values({
          id: crypto.randomUUID(),
          userId,
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