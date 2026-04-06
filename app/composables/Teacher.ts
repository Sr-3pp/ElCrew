import type { Teacher, TeacherPayload } from '~~/types/teacher'
import { toTeacherFormData } from '~~/app/utils/teacher-util'


export const useTeachers = () => {
    const getTeachers = async () => {
        return $fetch<Teacher[]>('/api/teachers', {
            credentials: 'include'
        })
    }

    const createTeacher = async (payload: TeacherPayload) => {
        return $fetch<Teacher>('/api/admin/teachers', {
            method: 'POST',
            body: toTeacherFormData(payload),
            credentials: 'include',
        })
    }

    const updateTeacher = async (id: string, payload: TeacherPayload) => {
        return $fetch<Teacher>(`/api/admin/teachers/${id}`, {
            method: 'PATCH',
            body: toTeacherFormData(payload),
            credentials: 'include',
        })
    }

    const deleteTeacher = async (id: string) => {
        return $fetch<{ id: string }>(`/api/admin/teachers/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
    }

    const getTeacherByUsername = async (username: string) => {
        return $fetch<Teacher>(`/api/teachers/${username}`, {
            credentials: 'include',
        })
    }

    return {
        getTeachers,
        createTeacher,
        updateTeacher,
        deleteTeacher,
        getTeacherByUsername,
    }
}
