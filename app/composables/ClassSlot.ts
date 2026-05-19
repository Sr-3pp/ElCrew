import { Time } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import type { Ref } from 'vue'
import type {
  ClassSlotBatchForm,
  ClassSlotDay,
  ClassSlotDayGroup,
  ClassSlotForm,
  ClassSlotItem,
  ClassSlotLocationOption,
  ClassSlotMutationResult,
  PublicClassSlotItem,
  TeacherClassSlotItem,
  CreateClassSlotPayload,
  DeleteClassSlotPayload,
  UpdateClassSlotPayload,
} from '~~/types/class-slot'

export const createClassSlotBatchFormState = (): ClassSlotBatchForm => ({
  placement: '',
  date: '',
  times: [null],
  notes: '',
})

export const hasClassSlotTimeValue = (value: unknown): value is Time => {
  return typeof value === 'object' && value !== null && 'hour' in value && 'minute' in value
}

export const getValidClassSlotTimes = (values: unknown[]) => {
  return values.filter(hasClassSlotTimeValue)
}

export const formatClassSlotTime = (value: Time | null | undefined) => {
  if (!value) {
    return '00:00'
  }

  const hour = String(value.hour).padStart(2, '0')
  const minute = String(value.minute).padStart(2, '0')

  return `${hour}:${minute}`
}

export const formatClassSlotTimeLabel = (value: string, locale = 'en-US') => {
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

export const formatClassSlotDate = (date: string, locale = 'es-MX') => {
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

export const getUniqueClassSlotTimes = (times: Time[]) => {
  const seen = new Set<string>()

  return times.filter((time) => {
    const formattedTime = formatClassSlotTime(time)

    if (seen.has(formattedTime)) {
      return false
    }

    seen.add(formattedTime)
    return true
  })
}

export const createEmptyClassSlotDay = (date = ''): ClassSlotDay => ({
  date,
  placement: '',
  appointments: [],
})

export const createEmptyClassSlotDayGroup = <T extends ClassSlotItem>(date = ''): ClassSlotDayGroup<T> => ({
  date,
  placement: '',
  appointments: [],
})

export const groupClassSlotsByDate = <T extends ClassSlotItem>(classSlots: T[]): Record<string, ClassSlotDayGroup<T>> => {
  return classSlots.reduce<Record<string, ClassSlotDayGroup<T>>>((classSlotsByDate, item) => {
    const dayClassSlots = classSlotsByDate[item.scheduledDate] ?? createEmptyClassSlotDayGroup<T>(item.scheduledDate)

    dayClassSlots.appointments.push(item)

    if (!dayClassSlots.placement) {
      dayClassSlots.placement = item.placement
    }

    classSlotsByDate[item.scheduledDate] = dayClassSlots

    return classSlotsByDate
  }, {})
}

export const getClassSlotDay = <T extends ClassSlotItem>(classSlotsByDate: Record<string, ClassSlotDayGroup<T>>, date: string) => {
  return classSlotsByDate[date] ?? createEmptyClassSlotDayGroup<T>(date)
}

export const hasBookedClassSlotTime = <T extends ClassSlotItem>(classSlotsByDate: Record<string, ClassSlotDayGroup<T>>, date: string, time: string) => {
  return getClassSlotDay(classSlotsByDate, date).appointments.some(appointment => appointment.scheduledTime === time)
}

export const useClassSlotCalendar = <T extends ClassSlotItem>(
  classSlots: Ref<T[] | null | undefined>,
  selectedDate: Ref<CalendarDate>,
) => {
  const classSlotsByDate = computed(() => groupClassSlotsByDate(classSlots.value ?? []))
  const selectedDateKey = computed(() => selectedDate.value.toString())
  const currentDayClassSlots = computed(() => getClassSlotDay(classSlotsByDate.value, selectedDateKey.value))

  const hasClassSlotsOnDay = (day: CalendarDate) => {
    return getClassSlotDay(classSlotsByDate.value, day.toString()).appointments.length > 0
  }

  const isTimeBooked = (date: string, time: string) => {
    return hasBookedClassSlotTime(classSlotsByDate.value, date, time)
  }

  return {
    classSlotsByDate,
    selectedDateKey,
    currentDayClassSlots,
    hasClassSlotsOnDay,
    isTimeBooked,
  }
}

export const useClassSlots = (teacherId?: string) => {
  const classSlotKey = teacherId ? `class-slots-${teacherId}` : 'class-slots'
  const publicClassSlotKey = 'public-class-slots'

  const getClassSlots = async () => apiFetch<TeacherClassSlotItem[]>('/api/profile/class-slots')

  const saveClassSlot = async (classSlot: CreateClassSlotPayload) => apiFetch<ClassSlotItem>('/api/profile/class-slots', {
    method: 'POST',
    body: classSlot,
  })

  const deleteClassSlot = async (classSlot: DeleteClassSlotPayload) => apiFetch<ClassSlotMutationResult>('/api/profile/class-slots', {
    method: 'DELETE',
    body: classSlot,
  })

  const updateClassSlot = async (classSlot: UpdateClassSlotPayload) => apiFetch<ClassSlotMutationResult>('/api/profile/class-slots', {
    method: 'PATCH',
    body: classSlot,
  })

  const useClassSlotData = () => useAsyncData(classSlotKey, getClassSlots)

  const getPublicClassSlots = async () => apiFetch<PublicClassSlotItem[]>('/api/class-slots')

  const usePublicClassSlotData = () => useAsyncData(publicClassSlotKey, getPublicClassSlots)

  return {
    classSlotKey,
    publicClassSlotKey,
    getClassSlots,
    getPublicClassSlots,
    saveClassSlot,
    deleteClassSlot,
    updateClassSlot,
    useClassSlotData,
    usePublicClassSlotData,
  }
}
