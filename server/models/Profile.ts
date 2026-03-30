import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { User } from './User';
import { personFields, timestampFields } from './shared';

export const Profile = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => User.id),
  contact: text('contact'),
  ...personFields({ required: false }),
  ...timestampFields,
});
