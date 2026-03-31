// Handler uses the runtime event shape provided by Nitro/H3. Keep untyped to avoid
// coupling with ambient declarations in different environments.
function xmlEscape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public;
  const base = (siteUrl || '').replace(/\/$/, '');

  const urls = new Set<string>();
  const add = (path: string, lastmod?: string) => {
    const loc = `${base}${path}`;
    urls.add(
      `<url><loc>${xmlEscape(loc)}</loc>${
        lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''
      }</url>`,
    );
  };

  // Static routes
  add('/');
  add('/store');
  add('/products');
  add('/blog');
  add('/about');

  // Products from API
  try {
    type Product = {
      slug?: string | { value?: string } | null;
      id?: number | string | null;
      updatedAt?: string | null;
      createdAt?: string | null;
    };

    const list = (await $fetch<Product[]>('/api/product')) || [];
    for (const p of list) {
      let slug: string | undefined;
      if (typeof p.slug === 'string') slug = p.slug;
      else if (p.slug && typeof (p.slug as { value?: unknown }).value === 'string')
        slug = (p.slug as { value?: string }).value;
      else if (p.id != null) slug = String(p.id);

      if (slug) add(`/products/${slug}`, p.updatedAt ?? p.createdAt ?? undefined);
    }
  } catch {
    // Ignore fetch errors for sitemap generation
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].join('\n')}\n</urlset>`;

  setHeader(event, 'Content-Type', 'application/xml');
  return body;
});
