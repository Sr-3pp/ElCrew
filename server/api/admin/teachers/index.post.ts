import { tables, useDrizzle } from '~~/server/utils/drizzle';
import { isAdmin } from '~~/server/utils/requireSession';
import type { TeacherPayload } from '~~/types/teacher';

export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  const teacherPayload = await readBody<TeacherPayload>(event);

  const username = teacherPayload?.username?.trim();
  const email = teacherPayload?.email?.trim();
  const password = teacherPayload?.password?.trim();
  const name = teacherPayload?.name?.trim();
  const lastName = teacherPayload?.lastName?.trim();
  const dob = teacherPayload?.dob?.trim();
  const contact = teacherPayload?.contact?.trim() || null;

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

  const [profile] = await db
    .insert(tables.Profile)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      name,
      lastName,
      dob,
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
    contact: profile.contact,
  };
});
