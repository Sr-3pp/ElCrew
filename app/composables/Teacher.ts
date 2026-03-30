import type { Teacher, TeacherPayload } from '~~/types/teacher'


export const useTeachers = () => {
    const toTeacherFormData = (payload: TeacherPayload) => {
        const formData = new FormData()

        formData.append('username', payload.username)
        formData.append('email', payload.email)

        if (payload.password) {
            formData.append('password', payload.password)
        }

        formData.append('name', payload.name)
        formData.append('lastName', payload.lastName)
        formData.append('dob', payload.dob)

        if (payload.quote) {
            formData.append('quote', payload.quote)
        }

        if (payload.bio) {
            formData.append('bio', payload.bio)
        }

        if (payload.favoriteTricks) {
            formData.append('favoriteTricks', payload.favoriteTricks)
        }

        if (payload.areaOfFocus) {
            formData.append('areaOfFocus', payload.areaOfFocus)
        }

        if (payload.contact) {
            formData.append('contact', payload.contact)
        }

        const picture = Array.isArray(payload.picture) ? payload.picture[0] : payload.picture

        if (picture instanceof File) {
            formData.append('picture', picture)
        }

        return formData
    }

    const getTeachers = async () => {
        return $fetch<Teacher[]>('/api/teachers', {
            credentials: 'include'
        })
    }

    const getCurrentTeacher = async () => {
        return $fetch<Teacher>('/api/profile/teacher', {
            credentials: 'include',
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

    const updateCurrentTeacher = async (payload: TeacherPayload) => {
        return $fetch<Teacher>('/api/profile/teacher', {
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

    return {
        getTeachers,
        getCurrentTeacher,
        createTeacher,
        updateTeacher,
        updateCurrentTeacher,
        deleteTeacher,
    }
}
