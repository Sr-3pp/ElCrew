<script setup lang="ts">
import type { Student } from '~~/types/student'
import type { Teacher } from '~~/types/teacher'

definePageMeta({
    layout: 'panel'
})

const { getStudents, deleteStudent } = useStudents()
const { getTeachers } = useTeachers()

const { data: students, refresh } = await useAsyncData('students', () => getStudents())
const { data: teachers } = await useAsyncData('student-table-teachers', () => getTeachers())

const modalSw = ref(false)
const selectedStudent = ref<Student | null>(null)

const columns = [
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'lastName', header: 'Apellidos' },
    { accessorKey: 'dob', header: 'Fecha de nacimiento' },
    { accessorKey: 'teacherId', header: 'Maestra' },
    { id: 'actions', header: 'Acciones' },
]

const handleAddStudent = () => {
    selectedStudent.value = null
    modalSw.value = true
}

const handleStudentSaved = async () => {
    await refresh()
    modalSw.value = false
    selectedStudent.value = null
}

const handleEditStudent = (student: Student) => {
    selectedStudent.value = student
    modalSw.value = true
}

const handleDeleteStudent = async (student: Student) => {
    const shouldDelete = window.confirm(`¿Eliminar a ${student.name} ${student.lastName}?`)

    if (!shouldDelete) {
        return
    }

    const deleted = await deleteStudent(student.id)

    if (deleted) {
        await refresh()
    }
}

const getStudentActions = (student: Student) => [
    {
        label: 'Editar',
        icon: 'i-lucide-pencil',
        onSelect: () => handleEditStudent(student),
    },
    {
        label: 'Eliminar',
        icon: 'i-lucide-trash-2',
        color: 'error',
        onSelect: () => handleDeleteStudent(student),
    },
]

const modalTitle = computed(() => selectedStudent.value ? 'Editar alumna' : 'Agregar alumna')
const modalDescription = computed(() => selectedStudent.value ? 'Actualiza la información de la alumna.' : 'Agrega una nueva alumna al sistema.')
const tableRows = computed(() => students.value || [])

const teacherLabels = computed(() => {
    return new Map((teachers.value || []).map((teacher: Teacher) => [
        teacher.id,
        [teacher.name, teacher.lastName].filter(Boolean).join(' ').trim() || teacher.username,
    ]))
})

const getTeacherLabel = (teacherId: string | null) => {
    if (!teacherId) {
        return 'Sin asignar'
    }

    return teacherLabels.value.get(teacherId) || 'Maestra desconocida'
}
</script>

<template lang="pug">
section
    UContainer
        h1.text-2xl.font-bold Alumnas
        p Este es el panel de alumnas. Aquí puedes administrarlas.
        UButton(@click="handleAddStudent") Agregar alumna

        UTable(:data="tableRows" :columns="columns")
            template(#teacherId-cell="{ row }")
                span {{ getTeacherLabel(row.original.teacherId) }}
            template(#actions-cell="{ row }")
                UDropdownMenu(:items="getStudentActions(row.original)")
                    UButton(icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost")

    UModal(:title="modalTitle" :description="modalDescription" v-model:open="modalSw")
        template(#body)
            StudentForm(:student="selectedStudent" @saved="handleStudentSaved")
</template>
