<script setup lang="ts">
import type CtaProps from '~~/types/componentns/cta';

defineProps<{
    title: string
    subtitle?: string
    cta: CtaProps[]
}>()
</script>

<template lang="pug">
section
    UContainer(class="flex flex-col gap-6 py-16")
        h2.text-3xl.font-bold {{ title }}
        div.text-muted {{ subtitle }}
        div(class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center")
            UButton(v-for="(item, i) in cta" :key="`cta-banner-button-${i}`" :color="item.color || 'primary'" :variant="item.variant || 'solid'" :size="item.size || 'lg'" :label="item.label" :trailing-icon="item.icon")
</template>