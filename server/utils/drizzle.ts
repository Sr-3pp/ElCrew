import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '../models';

export { sql, eq, and, or } from 'drizzle-orm';

export const tables = schema;

export function useDrizzle() {
  const config = useRuntimeConfig();
  const isTest =
    process.env.NODE_ENV === 'test' || !!process.env.VITEST || !!process.env.VITEST_WORKER_ID;

  const isPrerender = process.env.NITRO_PRE_RENDER === '1' || process.env.NUXT_IS_PRERENDER === '1';

  const url = config.turso.url;
  const authToken = config.turso.token;
  const hasTurso = Boolean(url?.toString().trim());

  if ((isTest || (isPrerender && !hasTurso)) && (!url || url.trim() === '')) {
    const dummy = createClient({ url: 'file:disabled?mode=memory&cache=shared', authToken: '' });
    return drizzle(dummy, { schema });
  }

  if (!url || url.trim() === '') {
    throw createError({
      status: 500,
      statusText: 'Missing Turso database URL in runtime config (set NUXT_TURSO_URL or NUXT_TURSO_DATABASE_URL)',
    });
  }

  const turso = createClient({ url, authToken });
  return drizzle(turso, { schema });
}

export type User = typeof schema.User.$inferSelect;
export type NewUser = typeof schema.User.$inferInsert;
