export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public;
  const base = (siteUrl || '').replace(/\/$/, '');
  setHeader(event, 'Content-Type', 'text/plain');
  return `User-agent: *
Allow: /
Sitemap: ${base}/sitemap.xml\n`;
});
