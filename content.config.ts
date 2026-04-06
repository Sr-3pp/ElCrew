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
      source: {
        include: "config/**/*.json",
        prefix: "/config/",
      },
      // Accept any JSON shape for config files, but keep ZodObject (required by types)
      schema: z.object({}).catchall(z.any()),
    }),
    locations: defineCollection({
      type: 'data',
      source: {
        include: "locations/**/*.json",
        prefix: "/locations/",
      },
      // Define a schema for location data
      schema: z.object({
        key: z.string(),
        name: z.string(),
        coordinates: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        description: z.string().optional(),
        address: z.string(),
        picture: z.string(),
      }),
    }),
  },
});
