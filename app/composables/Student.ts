import type { Student, StudentPayload } from "~~/types/student"

export const useStudents = () => {
    const getStudents = async () => {
        try {
            const students = await apiFetch<Student[]>('/api/admin/students')
            return students || []
        } catch (error) {
            console.error('Error fetching students:', error)
            return []
        }
    }

    const createStudent = async (payload: StudentPayload) => {
        try {
            const student = await apiFetch<Student>('/api/admin/students', {
                method: 'POST',
                body: payload,
            })
            return student
        } catch (error) {
            console.error('Error creating student:', error)
            return null
        }
    }

    const updateStudent = async (id: string, payload: StudentPayload) => {
        try {
            const student = await apiFetch<Student>(`/api/admin/students/${id}`, {
                method: 'PATCH',
                body: payload,
            })
            return student
        } catch (error) {
            console.error('Error updating student:', error)
            return null
        }
    }

    const deleteStudent = async (id: string) => {
        try {
            await apiFetch(`/api/admin/students/${id}`, {
                method: 'DELETE',
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
