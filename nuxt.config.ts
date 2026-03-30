import { readdirSync } from 'node:fs'
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
    siteUrl: process.env.NUXT_SITE_URL || process.env.NUXT_PUBLIC_SITE_URL || '',
    turso: {
      url: process.env.NUXT_TURSO_URL || process.env.NUXT_TURSO_DATABASE_URL || '',
      token: process.env.NUXT_TURSO_TOKEN || ''
    },
    betterAuth: {
      token: process.env.BETTER_AUTH_SECRET || ''
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@vercel/analytics'
  ],

  css: ['@/assets/css/main.css'],

  nitro: {
    preset: 'vercel',
    prerender: {
      routes: prerenderRoutes
    }
  }
})
