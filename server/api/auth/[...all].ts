import type { H3Event } from 'h3';

const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD']);

async function eventToRequest(event: H3Event) {
  const url = getRequestURL(event).toString();
  const method = event.node.req.method || 'GET';
  const normalizedMethod = method.toUpperCase();
  const headers = new Headers();

  const incomingHeaders = event.node.req.headers;
  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
    } else if (value !== undefined) {
      headers.append(key, value);
    }
  }

  let body: BodyInit | undefined;
  if (!METHODS_WITHOUT_BODY.has(normalizedMethod)) {
    const raw = await readRawBody(event);
    if (raw !== null && raw !== undefined) {
      body = typeof raw === 'string' ? raw : Buffer.from(raw);
    }
  }

  return new Request(url, {
    method: normalizedMethod,
    headers,
    body,
  });
}

export default defineEventHandler(async (event) => {
  const auth = useAuth(event);
  const request = await eventToRequest(event);
  if (auth){
    const response = await auth.handler(request);
    return response;
  }

  return createError({
    status: 401,
    statusText: 'Unauthorized',
  });
});