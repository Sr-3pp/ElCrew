import { tables, useDrizzle } from '~~/server/utils/drizzle';
import { isAdmin } from '~~/server/utils/requireSession';

export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    return createError({ status: 403, statusText: 'Forbidden' }); 
  }

    const db = useDrizzle();

    const students = await db.select().from(tables.Student);

    return students;
})