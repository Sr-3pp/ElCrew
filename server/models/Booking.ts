import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { ClassSlot } from './ClassSlot';
import { Student } from './Student';
import { timestampFields } from './shared';

export const Booking = sqliteTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  classSlotId: text('class_slot_id').notNull().references(() => ClassSlot.id),
  studentId: text('student_id').notNull().references(() => Student.id),
  status: text('status').notNull().default('registered'),
  notes: text('notes'),
  ...timestampFields,
}, (table) => ({
  classSlotStudentUnique: uniqueIndex('bookings_class_slot_student_unique').on(table.classSlotId, table.studentId),
}));
