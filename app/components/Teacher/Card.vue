<script setup lang="ts">
import type { Teacher } from '~~/types/teacher';

defineProps<{
    teacher: Teacher
}>()

const cardUi = {
    header: 'flex justify-between'
}
</script>

<template lang="pug">
UCard(:ui="cardUi")
    template(#header)
        figure(class="p-3 rounded-xl bg-secondary flex items-center justify-center")
            UAvatar(:src="teacher.picture || undefined" :alt="teacher.name || teacher.username" size="lg")
        UBadge {{ [teacher.name, teacher.lastName].filter(Boolean).join(' ').trim() || teacher.username }}
    template(#body)
        p {{ teacher.bio || teacher.quote || 'Próximamente conocerás más sobre esta instructora.' }}
    template(#footer)
        UButton(:to="`/instructores/${teacher.username}`") Ver detalles
</template>
