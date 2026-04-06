export type Student = typeof import('~~/server/models/Student').Student.$inferSelect;
export type NewStudent = typeof import('~~/server/models/Student').Student.$inferInsert;

export type StudentPayload = Pick<NewStudent, 'name' | 'lastName' | 'dob' | 'contact' | 'teacherId'>;

export type StudentFormState = Omit<StudentPayload, 'contact'> & {
  whatsapp: string
  instagram: string
  tiktok: string
}
