import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { customSession } from 'better-auth/plugins/custom-session';
import type { H3Event } from 'h3';
import { useRuntimeConfig } from '#imports';

import { eq, useDrizzle, tables } from './drizzle';

function createAuthInstance(event?: H3Event) {
  const db = useDrizzle();
  const runtimeConfig = useRuntimeConfig(event);
  const requestURL = event ? getRequestURL(event) : null;
  const baseURL = runtimeConfig.siteUrl || (requestURL ? requestURL.origin : undefined);

  return betterAuth({
    baseURL,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: tables.User,
        session: tables.Session,
        account: tables.Account,
        verification: tables.Verification,
        rateLimit: tables.RateLimit,
      },
    }),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      fields: {
        name: 'username',
        emailVerified: 'emailVerified',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      },
      additionalFields: {
        isAdmin: {
          type: 'boolean',
          fieldName: 'isAdmin',
          required: false,
          input: false,
          defaultValue: false,
        },
        isTeacher: {
          type: 'boolean',
          fieldName: 'isTeacher',
          required: false,
          input: true,
          defaultValue: false,
        },
      },
    },
    session: {
      fields: {
        userId: 'userId',
        token: 'token',
        expiresAt: 'expiresAt',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      },
    },
    plugins: [
      customSession(async ({ user, session }) => {
        const [profile] = await db
          .select()
          .from(tables.Profile)
          .where(eq(tables.Profile.userId, user.id))
          .limit(1);

        return {
          session,
          user: {
            ...user,
            profile: profile ?? null,
          },
        };
      }),
    ],
  });
}

type AuthInstance = ReturnType<typeof createAuthInstance>;

let authSingleton: AuthInstance | null = null;

export function useAuth(event?: H3Event) {
  if (!authSingleton) {
    authSingleton = createAuthInstance(event);
  }

  return authSingleton;
}
