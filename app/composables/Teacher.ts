import type { Teacher, TeacherPayload } from '~~/types/teacher'
import { toTeacherFormData } from '~~/app/utils/teacher-util'

export const useTeachers = () => {
    const getTeachers = async () => apiFetch<Teacher[]>('/api/teachers')

    const createTeacher = async (payload: TeacherPayload) => {
        return apiFetch<Teacher>('/api/admin/teachers', {
            method: 'POST',
            body: toTeacherFormData(payload),
        })
    }

    const updateTeacher = async (id: string, payload: TeacherPayload) => {
        return apiFetch<Teacher>(`/api/admin/teachers/${id}`, {
            method: 'PATCH',
            body: toTeacherFormData(payload),
        })
    }

    const deleteTeacher = async (id: string) => {
        return apiFetch<{ id: string }>(`/api/admin/teachers/${id}`, {
            method: 'DELETE',
        })
    }

    const getTeacherByUsername = async (username: string) => {
        return apiFetch<Teacher>(`/api/teachers/${username}`)
    }

    return {
        getTeachers,
        createTeacher,
        updateTeacher,
        deleteTeacher,
        getTeacherByUsername,
    }
}
