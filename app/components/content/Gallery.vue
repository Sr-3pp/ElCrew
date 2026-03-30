<script setup lang="ts">
defineProps<{
    title: string
    subtitle?: string
    images: string[]
}>()
</script>

<template lang="pug">
section()
    UContainer.py-16.flex.flex-col.gap-8
        h2.text-3xl.font-bold {{ title }}
        div.flex.justify-between.items-center
            p.text-muted {{ subtitle }}
            UButton(variant="ghost" size="sm" label="View Full Portfolio" trailing-icon="i-lucide-arrow-right")
        div(class="grid grid-cols-1 sm:grid-cols-2 gap-8")
            figure
                NuxtImg(class="w-full h-full" :src="images[0]" alt="Portfolio Item 1" class="rounded-lg")
            div(class="grid grid-cols-1 sm:grid-cols-2 gap-8")
                figure(class="sm:col-span-2")
                    NuxtImg(class="w-full h-full" :src="images[1]" alt="Portfolio Item 2" class="rounded-lg")
                figure(class="sm:col-span-1")
                    NuxtImg(class="w-full h-full" :src="images[2]" alt="Portfolio Item 2" class="rounded-lg")
                figure(class="sm:col-span-1")
                    NuxtImg(class="w-full h-full" :src="images[3]" alt="Portfolio Item 2" class="rounded-lg")
</template>