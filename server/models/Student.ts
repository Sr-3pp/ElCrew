import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { personFields, timestampFields } from './shared';
import { User } from './User';

export const Student = sqliteTable('students', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  ...personFields({ dobRequired: true }),
  userId: text('user_id').unique().references(() => User.id),
  contact: text('contact'),
  teacherId: text('teacher_id').references(() => User.id),
  ...timestampFields,
});
