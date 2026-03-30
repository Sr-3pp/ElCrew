<script lang="ts" setup>
const { session } = useAuth()

const isScheduleModalOpen = ref(false)

</script>

<template lang="pug">
section
    UContainer
        h1 Profile Page {{ session?.name }}
        p This is the profile page. You can view and edit your profile information here.
        UButton(@click="isScheduleModalOpen = true" v-if="session.isTeacher") Schedule
    UDrawer(v-if="session.isTeacher" side="bottom" v-model:open="isScheduleModalOpen" title="Schedule a class" trigger="Schedule a class")
        template(#body)
            TeacherScheduleModal
</template>

<style>

</style>