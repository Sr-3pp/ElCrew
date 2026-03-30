<script setup lang="ts">
defineProps<{
    icon: string
}>()
</script>

<template lang="pug">
UCard(variant="soft" :ui="{ body: 'flex flex-col gap-4' }")
    span(class="size-20 flex items-center justify-center rounded-full bg-secondary/50 p-6")
        UIcon(:name="icon" size="lg" class="size-14")
    h3.text-xl.font-bold
        slot(name="title")
    div.text-muted
        slot(name="description")
</template>