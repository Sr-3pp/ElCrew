import type { AvailabilityFormPayload } from "~~/types/availability"

export const useSchedule = (teacherId: string) => {
    const getSchedule = async (month: string) => {
        return $fetch(`/api/profile/schedule?month=${month}`, {
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

    return {
        getSchedule,
        saveSchedule
    }

}