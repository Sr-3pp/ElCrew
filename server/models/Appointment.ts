import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { Student } from './Student';
import { User } from './User';
import { timestampFields } from './shared';

export const Appointment = sqliteTable('appointments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  studentId: text('student_id').notNull().references(() => Student.id),
  teacherId: text('teacher_id').notNull().references(() => User.id),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(60),
  notes: text('notes'),
  status: text('status').notNull().default('scheduled'),
  ...timestampFields,
});
