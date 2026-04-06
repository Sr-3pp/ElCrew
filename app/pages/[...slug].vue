<script lang="ts" setup>
const route = useRoute()

const { data: page } = await useAsyncData(`content-${route.path}`, () =>
  queryCollection('pages').where('path', '=', route.path).first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Page not found for path ${route.path}`,
  })
}

useContentSeo(page)
</script>

<template lang="pug">
ContentRenderer(v-if="page" :value="page")
</template>
