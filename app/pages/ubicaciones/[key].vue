<script setup lang="ts">
const {key} = useRoute().params
const {getLocationByKey} = useLocations()
const { data: location } = await useAsyncData(`location-${key}`, () => getLocationByKey(key as string))
</script>

<template lang="pug">
section
    UContainer.py-16.flex.flex-col.gap-8
        h2.text-3xl.font-bold {{ location?.meta?.name || 'Próximamente conocerás más sobre esta ubicación.' }}
        p.text-muted {{ location?.meta?.address || 'Muy pronto podrás conocer más sobre esta ubicación.' }}
        div(class="rounded-xl bg-secondary p-6 flex items-center justify-center")
            NuxtImg(:src="location?.meta?.picture || undefined" :alt="location?.meta?.name || 'Imagen de ubicación'" size="2xl" class="rounded-lg")
</template>