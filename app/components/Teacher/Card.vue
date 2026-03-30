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
            UAvatar(:src="teacher.profile.picture" size="lg")
        UBadge {{ teacher.name }}
    template(#body)
        p {{ teacher.description }}
    template(#footer)
        UButton(:to="`/maestros/${teacher.id}`") Ver detalles
</template>
