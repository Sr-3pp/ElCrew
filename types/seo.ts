export type ContentSeoMeta = {
  title?: string | null
  description?: string | null
  image?: string | null
  noindex?: boolean | null
}

export type SeoContentInput = {
  title?: string | null
  description?: string | null
  seo?: ContentSeoMeta | null
}
