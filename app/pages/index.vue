<script lang="ts" setup>
const { data: page } = await useAsyncData('content-home', () =>
  queryCollection('pages').where('stem', '=', 'index').first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Home page content not found',
  })
}
</script>

<template lang="pug">
ContentRenderer(v-if="page" :value="page")
</template>
