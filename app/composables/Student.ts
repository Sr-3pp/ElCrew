import type { Student, StudentPayload } from "~~/types/student"

export const useStudents = () => {
    const getStudents = async () => {
        try {
            const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

            const students = await $fetch<Student[]>('/api/admin/students', {
                credentials: 'include',
                headers,
            })
            return students || []
        } catch (error) {
            console.error('Error fetching students:', error)
            return []
        }
    }

    const createStudent = async (payload: StudentPayload) => {
        try {
            const student = await $fetch<Student>('/api/admin/students', {
                method: 'POST',
                body: payload,
                credentials: 'include',
            })
            return student
        } catch (error) {
            console.error('Error creating student:', error)
            return null
        }
    }

    const updateStudent = async (id: string, payload: StudentPayload) => {
        try {
            const student = await $fetch<Student>(`/api/admin/students/${id}`, {
                method: 'PATCH',
                body: payload,
                credentials: 'include',
            })
            return student
        } catch (error) {
            console.error('Error updating student:', error)
            return null
        }
    }

    const deleteStudent = async (id: string) => {
        try {
            await $fetch(`/api/admin/students/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            return true
        } catch (error) {
            console.error('Error deleting student:', error)
            return false
        }
    }

    return {
        getStudents,
        createStudent,
        updateStudent,
        deleteStudent,
    }
}   
