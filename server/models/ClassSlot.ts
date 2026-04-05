import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { User } from './User';
import { timestampFields } from './shared';

export const ClassSlot = sqliteTable('schedules', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  teacherId: text('teacher_id').notNull().references(() => User.id),
  placement: text('placement').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(60),
  notes: text('notes'),
  status: text('status').notNull().default('scheduled'),
  ...timestampFields,
});
