<script setup lang="ts">
import type PictureProps from '~~/types/componentns/picure';

defineProps<{
    icon?: string
    image: PictureProps
}>()
</script>


<template lang="pug">
section
    UContainer(class="py-16")
        UPageGrid(:ui="{ base: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-3' }")
            UCard(:ui="{ body: 'flex flex-col gap-4 h-full' }" class="sm:col-span-2" variant="solid")
                span(class="flex items-center justify-center size-16 rounded-xl bg-secondary")
                    UIcon(:name="icon || 'i-ri-article-line'" class="text-inverted size-8")
                h2.text-3xl.font-bold.text-primary
                    slot(name="title")
                div(class="text-inverted flex flex-col gap-4 my-auto")
                    slot(name="description")
            figure
                AppPicture(:image="image" class="w-full h-full" image-class="w-full h-full object-cover rounded-lg")
</template>