<script lang="ts" setup>
const { data: page } = await useAsyncData('content-home', () =>
  queryCollection('pages').where('stem', '=', 'index').first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'No se encontró el contenido de la página de inicio',
  })
}

useContentSeo(page)
</script>

<template lang="pug">
ContentRenderer(v-if="page" :value="page")
</template>
