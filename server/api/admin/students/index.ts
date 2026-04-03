export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    return createError({ status: 403, statusText: 'Forbidden' }); 
  }

    const db = useDrizzle();

    const students = await db.select().from(tables.Student);

    return students;
})