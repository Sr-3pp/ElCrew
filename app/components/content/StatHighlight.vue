<script setup lang="ts">
defineProps<{
    icon?: string
}>()
</script>

<template lang="pug">
section
    UContainer.py-16
        UPageGrid(:ui="{ base: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-3' }" class="bg-elevated rounded-xl")
            div(class="flex flex-col gap-4 sm:col-span-2 p-8")
                UIcon(:name="icon || 'i-ri-bar-chart-line'" class="text-secondary size-8")
                h3.text-3xl.font-bold.text-primary
                    slot(name="title")
                div(class="flex flex-col gap-2")
                    slot(name="description")
            div(class="p-8 flex flex-col items-center justify-center gap-2")
                div(class="text-4xl font-bold text-secondary")
                    slot(name="value")
                slot(name="value-label")

</template>