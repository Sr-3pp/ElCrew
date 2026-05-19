import type { H3Event } from 'h3'

type AuthSession = Awaited<ReturnType<typeof getAuthSession>>;
type AdminUser = NonNullable<AuthSession>['user'] & { isAdmin?: boolean };
type TeacherUser = NonNullable<AuthSession>['user'] & { isTeacher?: boolean };

function headersFromEvent(event: H3Event) {
  const incoming = getRequestHeaders(event);
  const headers = new Headers();
  for (const [key, value] of Object.entries(incoming)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
    } else if (value != null) {
      headers.append(key, value);
    }
  }
  return headers;
}

export async function getAuthSession(event: H3Event) {
  const auth = useAuth(event);
  const headers = headersFromEvent(event);
  return await auth?.api.getSession({ headers });
}

export async function requireAuthSession(event: H3Event) {
  const session = await getAuthSession(event);
  if (!session) {
    throw createError({ status: 401, statusText: 'Unauthorized' });
  }
  return session;
}

export async function requireAdminSession(event: H3Event) {
  const session = await getAuthSession(event);
  if (!session) {
    throw createError({ status: 401, statusText: 'Unauthorized' });
  }

  const user = session.user as AdminUser;

  if (!user?.isAdmin) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  return session as AuthSession & { user: AdminUser & { isAdmin: true } };
}

export async function requireTeacherSession(event: H3Event) {
  const session = await getAuthSession(event);
  if (!session) {
    throw createError({ status: 401, statusText: 'Unauthorized' });
  }

  const user = session.user as TeacherUser;

  if (!user?.isTeacher) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  return session as AuthSession & { user: TeacherUser & { isTeacher: true } };
}
