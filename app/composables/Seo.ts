import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { SeoContentInput } from '~~/types/seo'

const SITE_NAME = 'El Crew'
const DEFAULT_DESCRIPTION = 'Escuela de skate con instructoras, clases y ubicaciones para aprender con técnica, seguridad y comunidad.'

const normalizeSiteUrl = (value: string) => value.replace(/\/$/, '')

const buildAbsoluteUrl = (siteUrl: string, path?: string | null) => {
  const base = normalizeSiteUrl(siteUrl)

  if (!base) {
    return null
  }

  if (!path) {
    return base
  }

  if (/^https?:\/\//.test(path)) {
    return path
  }

  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export const useContentSeo = (page: MaybeRefOrGetter<SeoContentInput | null | undefined>) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()

  const siteUrl = computed(() => runtimeConfig.public.siteUrl || '')
  const pageValue = computed(() => toValue(page))
  const seoTitle = computed(() => pageValue.value?.seo?.title || pageValue.value?.title || undefined)
  const seoDescription = computed(() => pageValue.value?.seo?.description || pageValue.value?.description || DEFAULT_DESCRIPTION)
  const seoImage = computed(() => buildAbsoluteUrl(siteUrl.value, pageValue.value?.seo?.image || undefined))
  const canonicalUrl = computed(() => buildAbsoluteUrl(siteUrl.value, route.path))
  const shouldNoIndex = computed(() => Boolean(pageValue.value?.seo?.noindex))
  const robots = computed(() => shouldNoIndex.value ? 'noindex, nofollow' : 'index, follow')

  useSeoMeta({
    title: () => seoTitle.value,
    description: () => seoDescription.value,
    ogTitle: () => seoTitle.value || SITE_NAME,
    ogDescription: () => seoDescription.value,
    ogType: 'website',
    ogImage: () => seoImage.value || undefined,
    twitterTitle: () => seoTitle.value || SITE_NAME,
    twitterDescription: () => seoDescription.value,
    twitterImage: () => seoImage.value || undefined,
    robots: () => robots.value,
  })

  useHead(() => ({
    link: canonicalUrl.value
      ? [{ rel: 'canonical', href: canonicalUrl.value }]
      : [],
  }))
}

export const useGlobalSeo = () => {
  useHead({
    htmlAttrs: {
      lang: 'es-MX',
    },
    titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} | ${SITE_NAME}` : SITE_NAME,
  })

  useSeoMeta({
    applicationName: SITE_NAME,
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    themeColor: '#4A90E2',
    description: DEFAULT_DESCRIPTION,
    ogDescription: DEFAULT_DESCRIPTION,
    twitterDescription: DEFAULT_DESCRIPTION,
  })
}
