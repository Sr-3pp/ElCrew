<script setup lang="ts">
import { getTeacherSinceLabel, toTeacherFromSession } from '~~/app/utils/teacher-util'

const { session, fetchSession, refreshSession } = useAuth()
const { updateProfile: submitTeacherProfile } = useProfile()

const isClassSlotModalOpen = ref(false)
const isFormOpen = ref(false)
const isPageReady = ref(false)

const isTeacher = computed(() => Boolean(session.value?.isTeacher))

const teacher = computed(() => toTeacherFromSession(session.value))
const teacherSinceLabel = computed(() => getTeacherSinceLabel(teacher.value))

const handleTeacherSaved = async () => {
    await refreshSession()
    isFormOpen.value = false
}

onMounted(async () => {
    await fetchSession()
    isPageReady.value = true
})

const gridUi = {
    base: 'grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6',
}

const grid2Ui = {
    base: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6',
}

</script>

<template lang="pug">
section
    UContainer(class="py-16")
        UPageGrid(:ui="gridUi")
            div(class="sm:col-span-3 bg-gradient-to-br from-elevated to-muted p-4 flex gap-8 rounded-4xl")
                figure(class="w-1/3 my-auto relative p-4 flex-shrink-0 before:absolute before:top-2 before:left-2 before:bg-secondary before:rounded-4xl before:z-1 before:rotate-[-5deg] before:w-[80%] before:h-[80%]")
                    NuxtImg(class="aspect-square bg-muted rounded-4xl object-cover relative z-2 p-2" :src="teacher?.picture" v-if="teacher?.picture" alt="Foto de la maestra")
                div(class="flex flex-col gap-4 p-4 w-full")
                    p(class="flex gap-6")
                        UBadge(:label="teacher?.areaOfFocus" color="primary" size="xl" v-if="teacher?.areaOfFocus")
                        UBadge(:label="teacherSinceLabel" size="xl" color="secondary" v-if="teacherSinceLabel")
                    h2(class="text-3xl font-bold") {{ teacher?.name }} {{ teacher?.lastName }}
                    p(class="italic my-auto") "{{ teacher?.quote }}"
                    div(class="flex gap-4 mt-auto justify-end")
                        UButton(@click="isClassSlotModalOpen = true" v-if="isPageReady && isTeacher") Horarios
                        UButton(@click="isFormOpen = true" v-if="isPageReady && isTeacher") Editar perfil
            div(class="flex flex-col gap-8")
                article(class="flex bg-muted p-6 rounded-2xl")
                    div
                        h4(class="text-muted text-xs font-bold uppercase") Alumnas entrenadas
                        p(class="text-3xl font-bold text-primary") 240
                    UIcon(name="i-ri-user-3-line" class="ml-auto my-auto size-10")
                
                article(class="flex bg-muted p-6 rounded-2xl")
                    div
                        h4(class="text-muted text-xs font-bold uppercase") Alumnas entrenadas
                        p(class="text-3xl font-bold text-primary") 240
                    UIcon(name="i-ri-user-3-line" class="ml-auto my-auto size-10")
                
                article(class="flex bg-secondary p-6 rounded-2xl")
                    div
                        h4(class="text-muted text-xs font-bold uppercase") Clases esta semana
                        p(class="text-3xl font-bold text-primary") 12
                    UIcon(name="i-ri-user-3-line" class="ml-auto my-auto size-10")
                
    UContainer(class="pb-16")
        UPageGrid(:ui="grid2Ui")
            div(class="sm:col-span-2")
                UCard(class="h-full")
                    template(#header)
                        .flex.items-center.gap-4
                            UIcon(name="i-ri-trophy-line" class="size-6 text-primary")
                            h2(class="text-2xl font-bold") Biografía y experiencia

                    p {{ teacher?.bio || 'No hay biografía disponible.' }}
            div
                UCard(variant="solid")
                    template(#header)
                        .flex.items-center.gap-4
                            UIcon(name="i-ri-award-line" class="size-6 text-primary")
                            h2(class="text-2xl font-bold") Trucos favoritos
                    
                    ul
                        li(v-for="trick in teacher?.favoriteTricks?.split(',') || []" :key="trick") {{ trick }}

    UContainer(class="pb-16")
        UPageGrid(:ui="gridUi")
            div(class="sm:col-span-3")
                UCard(variant="solid" class="h-full")
                    p calendar here
            div(class="flex flex-col gap-8")
                UCard(variant="soft" class="h-full")
                    template(#header)
                        h3 Comentarios de alumnas
                    div(class="flex flex-col gap-4")
                        p(class="italic") "Increíble instructora, me ayudó muchísimo a aterrizar mi kickflip."

    UDrawer(v-if="isPageReady && isTeacher" side="bottom" v-model:open="isClassSlotModalOpen" title="Administrar horarios" description="Gestiona los horarios de clase de esta maestra" trigger="Administrar horarios")
        template(#body)
            ClassSlotModal(:teacher-id="teacher?.id")
    UModal(v-if="isPageReady && isTeacher" v-model:open="isFormOpen" title="Editar perfil de maestra" description="Actualiza la información del perfil de esta maestra" trigger="Editar perfil de maestra")
        template(#body)
            TeacherForm(
                v-if="teacher"
                :teacher="teacher"
                :submit-teacher="submitTeacherProfile"
                @saved="handleTeacherSaved"
            )
            p.text-sm.text-error(v-else) No se pudo cargar la información de la maestra.
</template>

<style>

</style>
