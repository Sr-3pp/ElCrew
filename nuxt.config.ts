import { access, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

function getContentPageRoutes(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  const routes: string[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      routes.push(...getContentPageRoutes(fullPath))
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue
    }

    const routePath = relative(resolve('content/pages'), fullPath)
      .replace(/\\/g, '/')
      .replace(/\.md$/, '')

    routes.push(routePath === 'index' ? '/' : `/${routePath}`)
  }

  return routes
}

const prerenderRoutes = getContentPageRoutes(resolve('content/pages'))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  experimental: {
    payloadExtraction: false,
  },

  fonts: {
    provider: 'google',
    families: [
      {
        name: 'Fredoka',
        provider: 'google',
        global: true,
        weights: ['500 700'],
      },
      {
        name: 'Nunito',
        provider: 'google',
        global: true,
        weights: ['400 700'],
      },
    ],
  },
  
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_SITE_URL || process.env.NUXT_PUBLIC_SITE_URL || '',
      r2PublicBaseUrl:
        process.env.R2_PUBLIC_BASE_URL || process.env.NUXT_PUBLIC_R2_PUBLIC_BASE_URL || '',
    },
    turso: {
      url: process.env.NUXT_TURSO_URL || process.env.NUXT_TURSO_DATABASE_URL || '',
      token: process.env.NUXT_TURSO_TOKEN || ''
    },
    betterAuth: {
      token: process.env.BETTER_AUTH_SECRET || ''
    },
    r2: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? process.env.NUXT_R2_ACCESS_KEY_ID ?? '',
      accountId: process.env.R2_ACCOUNT_ID ?? process.env.NUXT_R2_ACCOUNT_ID ?? '',
      bucketName: process.env.R2_BUCKET_NAME ?? process.env.NUXT_R2_BUCKET_NAME ?? '',
      secretAccessKey:
        process.env.R2_SECRET_ACCESS_KEY ?? process.env.NUXT_R2_SECRET_ACCESS_KEY ?? '',
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@vercel/analytics',
    '@nuxthub/core',
    '@nuxtjs/leaflet'
  ],

  css: ['@/assets/css/main.css'],

  nitro: {
    preset: 'vercel',
    prerender: {
      routes: prerenderRoutes
    }
  },
  
  hub: {
    blob: {
      driver: 's3',
      endpoint:
        process.env.R2_ENDPOINT
        ?? process.env.NUXT_R2_ENDPOINT
        ?? `https://${process.env.R2_ACCOUNT_ID ?? process.env.NUXT_R2_ACCOUNT_ID ?? ''}.r2.cloudflarestorage.com`,
      region: 'auto',
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? process.env.NUXT_R2_ACCESS_KEY_ID ?? '',
      secretAccessKey:
        process.env.R2_SECRET_ACCESS_KEY ?? process.env.NUXT_R2_SECRET_ACCESS_KEY ?? '',
      bucket: process.env.R2_BUCKET_NAME ?? process.env.NUXT_R2_BUCKET_NAME ?? '',
    }
  }
})