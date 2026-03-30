import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { User } from './User';
import { timestampFields } from './shared';

export const TeacherAvailability = sqliteTable('teacher_availability', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  teacherId: text('teacher_id').notNull().references(() => User.id),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  ...timestampFields,
}, (table) => ({
  teacherDateStartUnique: uniqueIndex('teacher_availability_teacher_date_start_unique')
    .on(table.teacherId, table.date, table.startTime),
}));
