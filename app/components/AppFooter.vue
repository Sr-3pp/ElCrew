<script setup lang="ts"></script>

<template lang="pug">
footer
  UContainer
    div(class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6")
      div(class="text-sm text-muted") &copy; {{ new Date().getFullYear() }} ElCrew. All rights reserved.
</template>

<style scoped></style>
