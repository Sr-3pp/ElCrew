<script setup lang="ts">
const {getTeachers} = useTeachers()

const { data: teachers } = await useAsyncData('teacherss', () => getTeachers())

</script>

<template lang="pug">
    section
        UContainer.py-16.flex.flex-col.gap-8
            h2.text-3xl.font-bold Nuestras instructoras
            p.text-muted Conoce a quienes acompañan cada proceso con técnica, experiencia y mucha calle.
            ul(class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3")
                li(v-for="teacher in teachers" :key="teacher.id")
                    TeacherCard(:teacher="teacher")
</template>
