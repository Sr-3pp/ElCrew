import { Time } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import type { Ref } from 'vue'
import type {
  CreateSchedulePayload,
  DeleteSchedulePayload,
  ScheduleBatchForm,
  ScheduleByDate,
  ScheduleDay,
  ScheduleForm,
  ScheduleItem,
  ScheduleLocationOption,
  ScheduleMutationResult,
  UpdateSchedulePayload,
} from '~~/types/schedule'

export const createScheduleFormState = (): ScheduleForm => ({
  placement: '',
  date: '',
  time: null,
  notes: '',
})

export const createScheduleBatchFormState = (): ScheduleBatchForm => ({
  placement: '',
  date: '',
  times: [null],
  notes: '',
})

export const hasScheduleTimeValue = (value: unknown): value is Time => {
  return typeof value === 'object' && value !== null && 'hour' in value && 'minute' in value
}

export const getValidScheduleTimes = (values: unknown[]) => {
  return values.filter(hasScheduleTimeValue)
}

export const formatScheduleTime = (value: Time | null | undefined) => {
  if (!value) {
    return '00:00'
  }

  const hour = String(value.hour).padStart(2, '0')
  const minute = String(value.minute).padStart(2, '0')

  return `${hour}:${minute}`
}

export const formatScheduleTimeLabel = (value: string, locale = 'en-US') => {
  const [hour, minute] = value.split(':').map(Number)

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    return value
  }

  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export const formatScheduleDate = (date: string, locale = 'es-MX') => {
  if (!date) {
    return ''
  }

  const [year, month, day] = date.split('-').map(Number)

  if (!year || !month || !day) {
    return date
  }

  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getUniqueScheduleTimes = (times: Time[]) => {
  const seen = new Set<string>()

  return times.filter((time) => {
    const formattedTime = formatScheduleTime(time)

    if (seen.has(formattedTime)) {
      return false
    }

    seen.add(formattedTime)
    return true
  })
}

export const createEmptyScheduleDay = (date = ''): ScheduleDay => ({
  date,
  placement: '',
  appointments: [],
})

export const groupScheduleByDate = (schedule: ScheduleItem[]): ScheduleByDate => {
  return schedule.reduce<ScheduleByDate>((appointmentsByDate, item) => {
    const daySchedule = appointmentsByDate[item.scheduledDate] ?? createEmptyScheduleDay(item.scheduledDate)

    daySchedule.appointments.push(item)

    if (!daySchedule.placement) {
      daySchedule.placement = item.placement
    }

    appointmentsByDate[item.scheduledDate] = daySchedule

    return appointmentsByDate
  }, {})
}

export const getScheduleDay = (scheduleByDate: ScheduleByDate, date: string) => {
  return scheduleByDate[date] ?? createEmptyScheduleDay(date)
}

export const hasScheduledTime = (scheduleByDate: ScheduleByDate, date: string, time: string) => {
  return getScheduleDay(scheduleByDate, date).appointments.some(appointment => appointment.scheduledTime === time)
}

const toScheduleLocationOption = (location: { meta?: Record<string, unknown> }) => {
  const label = typeof location.meta?.name === 'string' ? location.meta.name : null
  const value = typeof location.meta?.key === 'string' ? location.meta.key : null

  if (!label || !value) {
    return null
  }

  return {
    label,
    value,
  } satisfies ScheduleLocationOption
}

export const useScheduleLocations = () => {
  const { data: locations } = useAsyncData(
    'schedule-locations',
    () => queryCollection('config').where('stem', 'LIKE', '%locations%').all(),
  )

  const locationOptions = computed<ScheduleLocationOption[]>(() => {
    return locations.value?.flatMap((location) => {
      const option = toScheduleLocationOption(location)

      return option ? [option] : []
    }) ?? []
  })

  const getLocationLabel = (value: string) => {
    return locationOptions.value.find(option => option.value === value)?.label ?? value
  }

  return {
    locationOptions,
    getLocationLabel,
  }
}

export const useScheduleCalendar = (
  schedule: Ref<ScheduleItem[] | null | undefined>,
  selectedDate: Ref<CalendarDate>,
) => {
  const scheduleByDate = computed(() => groupScheduleByDate(schedule.value ?? []))
  const selectedDateKey = computed(() => selectedDate.value.toString())
  const currentDaySchedule = computed(() => getScheduleDay(scheduleByDate.value, selectedDateKey.value))

  const hasAppointmentsOnDay = (day: CalendarDate) => {
    return getScheduleDay(scheduleByDate.value, day.toString()).appointments.length > 0
  }

  const isTimeBooked = (date: string, time: string) => {
    return hasScheduledTime(scheduleByDate.value, date, time)
  }

  return {
    scheduleByDate,
    selectedDateKey,
    currentDaySchedule,
    hasAppointmentsOnDay,
    isTimeBooked,
  }
}

export const useSchedule = (teacherId?: string) => {
  const scheduleKey = teacherId ? `schedule-${teacherId}` : 'schedule'

  const getSchedule = async () => $fetch<ScheduleItem[]>('/api/profile/schedule', {
    credentials: 'include',
  })

  const saveSchedule = async (schedule: CreateSchedulePayload) => $fetch<ScheduleItem>('/api/profile/schedule', {
    method: 'POST',
    credentials: 'include',
    body: schedule,
  })

  const deleteSchedule = async (schedule: DeleteSchedulePayload) => $fetch<ScheduleMutationResult>('/api/profile/schedule', {
    method: 'DELETE',
    credentials: 'include',
    body: schedule,
  })

  const updateSchedule = async (schedule: UpdateSchedulePayload) => $fetch<ScheduleMutationResult>('/api/profile/schedule', {
    method: 'PATCH',
    credentials: 'include',
    body: schedule,
  })

  const useScheduleData = () => useAsyncData(scheduleKey, getSchedule)

  return {
    scheduleKey,
    getSchedule,
    saveSchedule,
    deleteSchedule,
    updateSchedule,
    useScheduleData,
  }
}
