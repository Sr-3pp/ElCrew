<script setup lang="ts">
import type PictureProps from '~~/types/componentns/picure'
import type CtaProps from '~~/types/componentns/cta'

defineProps<{
  image: PictureProps
  cta?: CtaProps[]
  badge?: {
    text: string
    color: string
    icon?: string
  }
}>()
</script>

<template lang="pug">
section(class="py-16")
    UContainer(class="flex flex-col sm:flex-row-reverse relative gap-8 sm:gap-10")
        figure(class="w-full sm:w-1/2 relative sm:px-20")
            AppPicture(:image="image" class="w-full overflow-hidden" image-class="object-cover w-full sm:rotate-[3deg] rounded-lg shadow-lg dark:shadow-white/16")
            div(class="absolute inset-0 rounded-lg bg-gradient-to-t from-black/80 via-black/45 to-transparent sm:hidden pointer-events-none")
            figcaption(v-if="'caption' in $slots" class="hidden sm:flex text-sm text-primary bg-white p-4 rounded-lg absolute bottom-0 left-0 w-1/3 rotate-[-3deg] shadow-md dark:shadow-white/16")
                slot(name="caption")
        div(class="flex flex-col justify-center gap-4 sm:gap-8 px-10 sm:p-6 w-full sm:w-1/2 absolute sm:static top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:translate-x-0 sm:translate-y-0")
            UBadge(v-if="badge" :color="badge.color || 'primary'" :label="badge.text" :icon="badge.icon" class="self-start")
            h1(class="text-4xl sm:text-6xl font-bold")
                slot(name="title")
            div(v-if="'description' in $slots" class="text-lg text-muted [&_p]:m-0")
                slot(name="description")
            div(class="hidden sm:flex flex-col sm:flex-row gap-4")
                UButton(v-for="(item, index) in cta" :key="`hero-cta-${index}`" :to="item.link" :color="item.color || 'primary'" size="lg" :trailing-icon="item.icon") {{ item.label }}
        div(class="sm:hidden flex flex-col sm:flex-row gap-6")
            UButton(v-for="(item, index) in cta" :key="`hero-cta-${index}`" :to="item.link" :color="item.color || 'primary'" size="lg" :trailing-icon="item.icon") {{ item.label }}
</template>
