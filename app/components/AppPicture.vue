<script lang="ts" setup>
import type PictureProps from '~~/types/componentns/picure';

defineProps<{
  image: PictureProps
  imageClass?: string
}>()
</script>

<template lang="pug">
  picture
    source(v-if="image.src.desktop" :srcset="image.src.desktop" media="(min-width: 1024px)")
    source(v-if="image.src.portrait" :srcset="image.src.portrait" media="(min-width: 768px)")
    NuxtImg(:src="image.src.mobile" :alt="image.alt" :class="imageClass || 'w-full h-auto rounded-lg shadow-lg'")
</template>