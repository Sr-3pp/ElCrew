import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

import { User } from './User';

export const Session = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => ({
    userIdx: index('sessions_user_idx').on(table.userId),
    tokenIdx: index('sessions_token_idx').on(table.token),
    expiresIdx: index('sessions_expires_idx').on(table.expiresAt),
  }),
);

export const Account = sqliteTable(
  'accounts',
  {
    id: text('id').primaryKey(),
    providerId: text('provider_id').notNull(),
    accountId: text('account_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    scope: text('scope'),
    password: text('password'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => ({
    providerAccountIdx: index('accounts_provider_account_idx').on(
      table.providerId,
      table.accountId,
    ),
    userIdx: index('accounts_user_idx').on(table.userId),
  }),
);

export const Verification = sqliteTable(
  'verifications',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => ({
    identifierIdx: index('verifications_identifier_idx').on(table.identifier),
    expiresIdx: index('verifications_expires_idx').on(table.expiresAt),
  }),
);

export const RateLimit = sqliteTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull().default(0),
  lastRequest: integer('last_request', { mode: 'timestamp' }).notNull(),
});
