import type { AvailabilityFormPayload } from "~~/types/availability"

export const useSchedule = (teacherId: string) => {
    const getSchedule = async (month: string) => {
        return $fetch(`/api/teachers/${teacherId}/schedule?month=${month}`, {
            credentials: 'include',
        })
    }

    const setSchedule = async (schedule: AvailabilityFormPayload) => {
        return $fetch(`/api/teachers/${teacherId}/schedule`, {
            method: 'POST',
            credentials: 'include',
            body: schedule,
        })
    }

    return {
        getSchedule,
        setSchedule
    }

}