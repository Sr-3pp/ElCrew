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
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'dob', header: 'Fecha de nacimiento' },
    { id: 'actions', header: 'Acciones' },
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
    const shouldDelete = window.confirm(`¿Eliminar a ${teacher.name || teacher.username}?`)

    if (!shouldDelete) {
        return
    }

    try {
        await deleteTeacher(teacher.id)
        await refresh()
    } catch (error) {
        console.error('Error al eliminar la maestra:', error)
    }
}

const getTeacherActions = (teacher: Teacher) => [
    {
        label: 'Editar',
        icon: 'i-lucide-pencil',
        onSelect: () => handleEditTeacher(teacher),
    },
    {
        label: 'Eliminar',
        icon: 'i-lucide-trash-2',
        color: 'error',
        onSelect: () => handleDeleteTeacher(teacher),
    },
]

const tableRows = computed(() => teachers.value || [])
const modalTitle = computed(() => selectedTeacher.value ? 'Editar maestra' : 'Agregar maestra')
const modalDescription = computed(() => selectedTeacher.value ? 'Actualiza la información de la maestra.' : 'Agrega una nueva maestra al sistema.')
</script>


<template lang="pug">
section
    UContainer
        h1.text-2xl.font-bold Maestras
        UButton(@click="handleAddTeacher") Agregar maestra

        UTable(:data="tableRows" :columns="columns")
            template(#name-cell="{ row }")
                span {{ [row.original.name, row.original.lastName].filter(Boolean).join(' ').trim() || row.original.username }}
            template(#dob-cell="{ row }")
                span {{ row.original.dob || 'Sin fecha de nacimiento' }}
            template(#actions-cell="{ row }")
                UDropdownMenu(:items="getTeacherActions(row.original)")
                    UButton(icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost")

    UModal(v-model:open="modalSw" :title="modalTitle" :description="modalDescription")
        template(#body)
            TeacherForm(:teacher="selectedTeacher" @saved="handleTeacherSaved")
</template>
