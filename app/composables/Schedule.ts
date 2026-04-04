import type { ScheduleForm } from '~~/types/schedule'

export const useSchedule = (teacherId: string) => {
    const getSchedule = async () =>  $fetch(`/api/profile/schedule`, {
            credentials: 'include'
        })

    const saveSchedule = async (schedule: ScheduleForm) =>  $fetch(`/api/profile/schedule`, {
            method: 'POST',
            credentials: 'include',
            body: schedule,
        })

    const deleteSchedule = async (schedule: { date: string, time: string }) =>  $fetch(`/api/profile/schedule`, {
            method: 'DELETE',
            credentials: 'include',
            body: schedule,
        })

    return {
        getSchedule,
        saveSchedule,
        deleteSchedule
    }

}
