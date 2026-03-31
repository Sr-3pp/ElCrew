<script setup lang="ts">
const { getTeachers } = useTeachers()

const { data: instructors } = await useAsyncData('instructors', () => getTeachers())

console.log('the instructors', instructors.value)
</script>

<template lang="pug">
section
  UContainer
    h1 El crew - Maestros
    ul
      li(v-for="instructor in instructors" :key="instructor.id")
        NuxtLink(:to="`/maestros/${instructor.id}`") {{ instructor.name }}
</template>

<style scoped></style>
