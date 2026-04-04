import type { Teacher, TeacherPayload } from '~~/types/teacher'
import { toTeacherFormData } from '~~/app/utils/teacher-util'

export const useProfile = () => {
    const updateProfile = async (payload: TeacherPayload) => {
        return $fetch<Teacher>('/api/profile', {
            method: 'PATCH',
            body: toTeacherFormData(payload),
            credentials: 'include',
        })
    }

    return {
        updateProfile,
    }
}
