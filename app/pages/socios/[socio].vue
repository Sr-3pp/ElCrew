<script setup lang="ts">
const route = useRoute()
const socio = route.params.socio
</script>


<template lang="pug">
section(class="w-full h-screen flex items-center justify-center")
    h1(class="text-4xl font-bold") Socio: {{ socio }}
</template>