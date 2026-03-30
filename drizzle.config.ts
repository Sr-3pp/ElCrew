import type { Config } from 'drizzle-kit';

const fallbackUrl = process.env.NUXT_TURSO_URL || 'libsql://placeholder-db';
const fallbackToken = process.env.NUXT_TURSO_TOKEN || 'placeholder-token';

export default {
  schema: './server/models/index.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: fallbackUrl,
    authToken: fallbackToken,
  },
} satisfies Config;
