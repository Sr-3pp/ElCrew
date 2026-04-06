<script setup lang="ts">
defineProps<{
    location: {
        id: string
        name: string
        address: string
        image: string
        meta: {
            key: string
        }
    }
}>()
</script>

<template lang="pug">
UCard
    template(#header)
        figure(class="p-3 rounded-xl bg-secondary flex items-center justify-center")
            NuxtImg(:src="location.image || undefined" :alt="location.name || 'Imagen de ubicación'" size="lg" class="rounded-full")
        UBadge {{ location.name }}
    template(#body)
        p {{ location.address || 'Próximamente conocerás más sobre esta ubicación.' }}
    template(#footer)
        UButton(:to="`/ubicaciones/${location.meta.key}`") Ver detalles  
</template>