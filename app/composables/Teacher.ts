import type { Teacher, TeacherPayload } from '~~/types/teacher'


export const useTeachers = () => {
    const getTeachers = async () => {
        const headers = process.server ? useRequestHeaders(['cookie']) : undefined

        return $fetch<Teacher[]>('/api/admin/teachers', {
            credentials: 'include',
            headers,
        })
    }

    const createTeacher = async (payload: TeacherPayload) => {
        return $fetch<Teacher>('/api/admin/teachers', {
            method: 'POST',
            body: payload,
            credentials: 'include',
        })
    }

    const updateTeacher = async (id: string, payload: TeacherPayload) => {
        return $fetch<Teacher>(`/api/admin/teachers/${id}`, {
            method: 'PATCH',
            body: payload,
            credentials: 'include',
        })
    }

    const deleteTeacher = async (id: string) => {
        return $fetch<{ id: string }>(`/api/admin/teachers/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
    }

    return {
        getTeachers,
        createTeacher,
        updateTeacher,
        deleteTeacher,
    }
}
