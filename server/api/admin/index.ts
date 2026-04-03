export default defineEventHandler(async (event) => {
  if (!(await isAdmin(event))) {
    return createError({ status: 403, statusText: 'Forbidden' }); 
  }

  return 'Hello Nitro'
})
