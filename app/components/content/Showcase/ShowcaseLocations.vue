<script setup lang="ts">
const { getLocations } = useLocations()

const { data: locations } = await useAsyncData('locationss', () => getLocations())
console.log('Ubicaciones obtenidas:', locations.value)
</script>

<template lang="pug">
section
    UContainer.py-16.flex.flex-col.gap-8
        h2.text-3xl.font-bold Dónde nos encontramos
        p.text-muted Encuentra nuestras sedes en la CDMX y el Estado de México, cada una con su propia vibra y estilo.
        ul(class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3")
            li(v-for="location in locations" :key="location.id")
                LocationCard(:location="location") 
</template>