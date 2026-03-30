import { tables, useDrizzle } from '~~/server/utils/drizzle';
import { isAdmin } from '~~/server/utils/requireSession';
import type { StudentPayload } from '~~/types/student';

export default defineEventHandler(async (event) => {
    if (!(await isAdmin(event))) {
        throw createError({ status: 403, statusText: 'Forbidden' });
    }

    const studentPayload = await readBody<StudentPayload>(event);

    const name = studentPayload?.name?.trim();
    const lastName = studentPayload?.lastName?.trim();
    const dob = studentPayload?.dob?.trim();
    const contact = studentPayload?.contact?.trim() || null;
    const teacherId = studentPayload?.teacherId?.trim();

    if (!name || !lastName || !dob || !teacherId) {
        throw createError({
            status: 400,
            statusText: 'name, lastName, dob, and teacherId are required',
        });
    }

    const db = useDrizzle();

    const [student] = await db
        .insert(tables.Student)
        .values({
            name,
            lastName,
            dob,
            contact,
            teacherId,
        })
        .returning();

    return student;
});
