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
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'dob', header: 'Date of Birth' },
    { accessorKey: 'teacherId', header: 'Teacher' },
    { id: 'actions', header: 'Actions' },
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
    const shouldDelete = window.confirm(`Delete ${student.name} ${student.lastName}?`)

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
        label: 'Edit',
        icon: 'i-lucide-pencil',
        onSelect: () => handleEditStudent(student),
    },
    {
        label: 'Delete',
        icon: 'i-lucide-trash-2',
        color: 'error',
        onSelect: () => handleDeleteStudent(student),
    },
]

const modalTitle = computed(() => selectedStudent.value ? 'Edit Student' : 'Add Student')
const modalDescription = computed(() => selectedStudent.value ? 'Update the student information.' : 'Add a new student to the system.')
const tableRows = computed(() => students.value || [])

const teacherLabels = computed(() => {
    return new Map((teachers.value || []).map((teacher: Teacher) => [
        teacher.id,
        [teacher.name, teacher.lastName].filter(Boolean).join(' ').trim() || teacher.username,
    ]))
})

const getTeacherLabel = (teacherId: string | null) => {
    if (!teacherId) {
        return 'Unassigned'
    }

    return teacherLabels.value.get(teacherId) || 'Unknown teacher'
}
</script>

<template lang="pug">
section
    UContainer
        h1.text-2xl.font-bold Students
        p This is the students panel. You can manage students here.
        UButton(@click="handleAddStudent") Add Student

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
