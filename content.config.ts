import { defineContentConfig, defineCollection, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: {
        include: "pages/**/*.md",
        prefix: "/",
      },
      schema: z.object({
        order: z.number().optional(),
      })
    }),
    // Data collection for JSON/YAML configuration files under content/_config
    config: defineCollection({
      type: 'data',
      source: 'config/**.{json,yml,yaml}',
      // Accept any JSON shape for config files, but keep ZodObject (required by types)
      schema: z.object({}).catchall(z.any()),
    }),
  },
});
