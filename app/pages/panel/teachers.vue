<script setup lang="ts">
import type { Teacher } from '~~/types/teacher'

definePageMeta({
    layout: 'panel'
})
const { getTeachers, deleteTeacher } = useTeachers()

const { data: teachers, refresh } = useAsyncData('teachers', () => getTeachers())

const modalSw = ref(false)
const selectedTeacher = ref<Teacher | null>(null)

const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'dob', header: 'Date of Birth' },
    { id: 'actions', header: 'Actions' },
]

const handleAddTeacher = () => {
    selectedTeacher.value = null
    modalSw.value = true
}

const handleTeacherSaved = async () => {
    modalSw.value = false
    selectedTeacher.value = null
    await refresh()
}

const handleEditTeacher = (teacher: Teacher) => {
    selectedTeacher.value = teacher
    modalSw.value = true
}

const handleDeleteTeacher = async (teacher: Teacher) => {
    const shouldDelete = window.confirm(`Delete ${teacher.name || teacher.username}?`)

    if (!shouldDelete) {
        return
    }

    try {
        await deleteTeacher(teacher.id)
        await refresh()
    } catch (error) {
        console.error('Error deleting teacher:', error)
    }
}

const getTeacherActions = (teacher: Teacher) => [
    {
        label: 'Edit',
        icon: 'i-lucide-pencil',
        onSelect: () => handleEditTeacher(teacher),
    },
    {
        label: 'Delete',
        icon: 'i-lucide-trash-2',
        color: 'error',
        onSelect: () => handleDeleteTeacher(teacher),
    },
]

const tableRows = computed(() => teachers.value || [])
const modalTitle = computed(() => selectedTeacher.value ? 'Edit Teacher' : 'Add Teacher')
const modalDescription = computed(() => selectedTeacher.value ? 'Update the teacher information.' : 'Add a new teacher to the system.')
</script>


<template lang="pug">
section
    UContainer
        h1.text-2xl.font-bold Teachers
        UButton(@click="handleAddTeacher") Add Teacher

        UTable(:data="tableRows" :columns="columns")
            template(#name-cell="{ row }")
                span {{ [row.original.name, row.original.lastName].filter(Boolean).join(' ').trim() || row.original.username }}
            template(#dob-cell="{ row }")
                span {{ row.original.dob || 'No birth date' }}
            template(#actions-cell="{ row }")
                UDropdownMenu(:items="getTeacherActions(row.original)")
                    UButton(icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost")

    UModal(v-model:open="modalSw" :title="modalTitle" :description="modalDescription")
        template(#body)
            TeacherForm(:teacher="selectedTeacher" @saved="handleTeacherSaved")
</template>
