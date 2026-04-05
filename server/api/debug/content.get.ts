export default defineEventHandler(async (event) => {
  try {
    const pages = await queryCollection(event, 'pages')
      .select('id', 'path', 'stem', 'title')
      .all()

    return {
      ok: true,
      count: pages.length,
      pages,
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))

    return {
      ok: false,
      name: err.name,
      message: err.message,
      stack: import.meta.dev ? err.stack : undefined,
    }
  }
})
