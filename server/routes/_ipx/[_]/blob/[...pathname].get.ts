
export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event);
  const placeholder =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" fill="%23ddd" font-size="14" dominant-baseline="middle" text-anchor="middle">placeholder</text></svg>';
  try {
    return await blob.serve(event, String(pathname || ''));
  } catch (_err) {
    void _err;
    try {
      setResponseHeader(event, 'Content-Type', 'image/svg+xml');
    } catch {
      // ignore
    }
    return placeholder;
  }
});