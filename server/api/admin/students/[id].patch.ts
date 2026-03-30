import { eq, tables, useDrizzle } from '~~/server/utils/drizzle';
import { isAdmin } from '~~/server/utils/requireSession';
import type { StudentPayload } from '~~/types/student';

export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    throw createError({ status: 403, statusText: 'Forbidden' });
  }

  const id = getRouterParam(event, 'id');
  const studentPayload = await readBody<StudentPayload>(event);

  const name = studentPayload?.name?.trim();
  const lastName = studentPayload?.lastName?.trim();
  const dob = studentPayload?.dob?.trim();
  const contact = studentPayload?.contact?.trim() || null;
  const teacherId = studentPayload?.teacherId?.trim();

  if (!id || !name || !lastName || !dob || !teacherId) {
    throw createError({
      status: 400,
      statusText: 'id, name, lastName, dob, and teacherId are required',
    });
  }

  const db = useDrizzle();

  const [student] = await db
    .update(tables.Student)
    .set({
      name,
      lastName,
      dob,
      contact,
      teacherId,
    })
    .where(eq(tables.Student.id, id))
    .returning();

  if (!student) {
    throw createError({ status: 404, statusText: 'Student not found' });
  }

  return student;
});
