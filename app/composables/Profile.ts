import type { AvailabilityFormPayload } from '~~/types/availability'
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

    const saveSchedule = async (schedule: AvailabilityFormPayload) => {
        return $fetch(`/api/profile/schedule`, {
            method: 'POST',
            credentials: 'include',
            body: schedule,
        })
    }

    const updateSchedule = async (schedule: AvailabilityFormPayload) => {
        return $fetch(`/api/profile/schedule`, {
            method: 'PATCH',
            credentials: 'include',
            body: schedule,
        })
     }

    return {
        updateProfile,
        saveSchedule,
        updateSchedule
    }
}
