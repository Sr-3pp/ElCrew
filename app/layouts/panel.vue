<script setup lang="ts">
</script>

<template lang="pug">
UDashboardGroup
  UDashboardPanel
    template(#header)
        .flex
            ul.flex.gap-2
                li
                NuxtLink(to="/panel/students") Alumnos
                li
                NuxtLink(to="/panel/teachers") Maestras
            UColorModeSwitch
    template(#body)
        NuxtPage
</template>

<style scoped></style>
