export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  return 'Hello Nitro'
})
