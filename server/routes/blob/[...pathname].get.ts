
import type { H3Event } from 'h3'

function normalizeBlobPath(pathname: string | undefined) {
  const trimmed = String(pathname || '').trim()
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

function placeholderSvg() {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"><rect width="100%" height="100%" fill="#222"/><text x="50%" y="50%" fill="#ddd" font-size="14" dominant-baseline="middle" text-anchor="middle">placeholder</text></svg>'
}

function publicBlobUrl(event: H3Event, blobPath: string) {
  const baseUrl = useRuntimeConfig(event).public.r2PublicBaseUrl?.trim().replace(/\/$/, '')
  if (!baseUrl) {
    return null
  }

  return `${baseUrl}${blobPath}`
}

export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event)
  const blobPath = normalizeBlobPath(pathname)

  try {
    return await blob.serve(event, blobPath)
  } catch {
    try {
      const [blobBody, blobMeta] = await Promise.all([
        blob.get(blobPath),
        blob.head(blobPath).catch(() => null),
      ])

      if (blobBody) {
        if (blobMeta?.contentType) {
          setResponseHeader(event, 'Content-Type', blobMeta.contentType)
        } else if (blobBody.type) {
          setResponseHeader(event, 'Content-Type', blobBody.type)
        }

        return blobBody.stream()
      }
    } catch {
      // ignore and fall through to placeholder
    }

    const fallbackUrl = publicBlobUrl(event, blobPath)
    if (fallbackUrl) {
      setResponseStatus(event, 302)
      setResponseHeader(event, 'Location', fallbackUrl)
      return ''
    }

    setResponseStatus(event, 404)
    setResponseHeader(event, 'Content-Type', 'image/svg+xml')
    return placeholderSvg()
  }
})
