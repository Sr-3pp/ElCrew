<script setup lang="ts">
const props = defineProps<{
    title: string
    subtitle?: string
    cols?: number
}>()

const columnClasses = {
    1: 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const

const columns = computed(() => {
    if (!props.cols) {
        return columnClasses[3]
    }

    return columnClasses[props.cols as keyof typeof columnClasses] ?? columnClasses[3]
})

</script>

<template lang="pug">
section(class="bg-muted")
    UContainer.py-16.flex.flex-col.gap-8
        h2.text-3xl.font-bold.text-center {{ title }}
        p.text-center.text-muted {{ subtitle }}
        UPageGrid(:ui="{ base: columns }" class="gap-8")
            slot
</template>
