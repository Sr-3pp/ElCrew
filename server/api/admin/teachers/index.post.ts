import { tables, useDrizzle } from '~~/server/utils/drizzle';
import { ensureProfileSchema } from '~~/server/utils/profile-schema';
import { isAdmin } from '~~/server/utils/requireSession';
import { readTeacherForm, uploadTeacherPicture } from '~~/server/utils/teacher-form';

export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  const {
    username,
    email,
    password,
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

  if (!username || !email || !password || !name || !lastName || !dob) {
    throw createError({
      status: 400,
      statusText: 'username, email, password, name, lastName, and dob are required',
    });
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(getRequestHeaders(event))) {
    if (typeof value === 'string') {
      headers.set(key, value);
    }
  }

  const signUpResponse = await $fetch<{ user?: { id: string; username: string; email: string; isTeacher?: boolean } }>(
    '/api/auth/sign-up/email',
    {
      method: 'POST',
      body: {
        name: username,
        username,
        email,
        password,
        isTeacher: true,
      },
      headers,
    },
  );

  const user = signUpResponse?.user;

  if (!user?.id) {
    throw createError({
      status: 500,
      statusText: 'Teacher account could not be created',
    });
  }

  const db = useDrizzle();
  await ensureProfileSchema(db)
  const picture = pictureFile ? await uploadTeacherPicture(user.id, pictureFile) : null;

  const [profile] = await db
    .insert(tables.Profile)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
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
    throw createError({
      status: 500,
      statusText: 'Teacher profile could not be created',
    });
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
