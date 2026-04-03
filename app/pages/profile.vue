<script lang="ts" setup>
import type { Teacher } from '~~/types/teacher'

const { session, fetchSession, refreshSession } = useAuth()
const { updateProfile } = useProfile()

const isScheduleModalOpen = ref(false)
const isFormOpen = ref(false)
const isPageReady = ref(false)

const isTeacher = computed(() => Boolean(session.value?.isTeacher))

const teacher = computed<Teacher | null>(() => {
    if (!session.value || !session.value.isTeacher) {
        return null
    }

    return {
        id: session.value.id,
        username: session.value.username || session.value.name || 'User',
        email: session.value.email,
        isTeacher: session.value.isTeacher,
        name: session.value.profile?.name || null,
        lastName: session.value.profile?.lastName || null,
        dob: session.value.profile?.dob || null,
        picture: session.value.profile?.picture || null,
        quote: session.value.profile?.quote || null,
        bio: session.value.profile?.bio || null,
        favoriteTricks: session.value.profile?.favoriteTricks || null,
        areaOfFocus: session.value.profile?.areaOfFocus || null,
        contact: session.value.profile?.contact || null,
    }
})

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
                    NuxtImg(class="aspect-square bg-muted rounded-4xl object-cover relative z-2 p-2" :src="teacher?.picture" v-if="teacher?.picture" alt="Teacher Picture")
                div(class="flex flex-col gap-4 p-4 w-full")
                    p(class="flex gap-6")
                        UBadge(:label="teacher?.areaOfFocus" color="primary" size="xl" v-if="teacher?.areaOfFocus")
                        UBadge(:label="'Instructor since ' + new Date(teacher?.createdAt || '').getFullYear()" size="xl" color="secondary")
                    h2(class="text-3xl font-bold") {{ teacher?.name }} {{ teacher?.lastName }}
                    p(class="italic my-auto") "{{ teacher?.quote }}"
                    div(class="flex gap-4 mt-auto justify-end")
                        UButton(@click="isScheduleModalOpen = true" v-if="isPageReady && isTeacher") Schedule
                        UButton(@click="isFormOpen = true" v-if="isPageReady && isTeacher") Edit Profile
            div(class="flex flex-col gap-8")
                article(class="flex bg-muted p-6 rounded-2xl")
                    div
                        h4(class="text-muted text-xs font-bold uppercase") Students Trained
                        p(class="text-3xl font-bold text-primary") 240
                    UIcon(name="i-ri-user-3-line" class="ml-auto my-auto size-10")
                
                article(class="flex bg-muted p-6 rounded-2xl")
                    div
                        h4(class="text-muted text-xs font-bold uppercase") Students Trained
                        p(class="text-3xl font-bold text-primary") 240
                    UIcon(name="i-ri-user-3-line" class="ml-auto my-auto size-10")
                
                article(class="flex bg-secondary p-6 rounded-2xl")
                    div
                        h4(class="text-muted text-xs font-bold uppercase") Classes this week
                        p(class="text-3xl font-bold text-primary") 12
                    UIcon(name="i-ri-user-3-line" class="ml-auto my-auto size-10")
                
    UContainer(class="pb-16")
        UPageGrid(:ui="grid2Ui")
            div(class="sm:col-span-2")
                UCard(class="h-full")
                    template(#header)
                        .flex.items-center.gap-4
                            UIcon(name="i-ri-trophy-line" class="size-6 text-primary")
                            h2(class="text-2xl font-bold") Biography & Expertise

                    p {{ teacher?.bio || 'No biography provided.' }}
            div
                UCard(variant="solid")
                    template(#header)
                        .flex.items-center.gap-4
                            UIcon(name="i-ri-award-line" class="size-6 text-primary")
                            h2(class="text-2xl font-bold") Favorite Tricks
                    
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
                        h3 Student Feedback
                    div(class="flex flex-col gap-4")
                        p(class="italic") "Amazing instructor, really helped me nail my kickflip!"

    UDrawer(v-if="isPageReady && isTeacher" side="bottom" v-model:open="isScheduleModalOpen" title="Schedule a class" description="Schedule a class with this teacher" trigger="Schedule a class")
        template(#body)
            TeacherScheduleModal(:teacher-id="teacher?.id")
    UModal(v-if="isPageReady && isTeacher" v-model:open="isFormOpen" title="Edit Teacher Profile" description="Edit the profile of this teacher" trigger="Edit Teacher Profile")
        template(#body)
            TeacherForm(
                v-if="teacher"
                :teacher="teacher"
                :submit-teacher="updateProfile"
                @saved="handleTeacherSaved"
            )
            p.text-sm.text-error(v-else) Unable to load teacher information.
</template>

<style>

</style>
