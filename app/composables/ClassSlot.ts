import { Time } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import type { Ref } from 'vue'
import type {
  ClassSlotBatchForm,
  ClassSlotByDate,
  ClassSlotDay,
  ClassSlotForm,
  ClassSlotItem,
  ClassSlotLocationOption,
  ClassSlotMutationResult,
  CreateClassSlotPayload,
  DeleteClassSlotPayload,
  UpdateClassSlotPayload,
} from '~~/types/class-slot'

export const createClassSlotFormState = (): ClassSlotForm => ({
  placement: '',
  date: '',
  time: null,
  notes: '',
})

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

export const groupClassSlotsByDate = (classSlots: ClassSlotItem[]): ClassSlotByDate => {
  return classSlots.reduce<ClassSlotByDate>((classSlotsByDate, item) => {
    const dayClassSlots = classSlotsByDate[item.scheduledDate] ?? createEmptyClassSlotDay(item.scheduledDate)

    dayClassSlots.appointments.push(item)

    if (!dayClassSlots.placement) {
      dayClassSlots.placement = item.placement
    }

    classSlotsByDate[item.scheduledDate] = dayClassSlots

    return classSlotsByDate
  }, {})
}

export const getClassSlotDay = (classSlotsByDate: ClassSlotByDate, date: string) => {
  return classSlotsByDate[date] ?? createEmptyClassSlotDay(date)
}

export const hasBookedClassSlotTime = (classSlotsByDate: ClassSlotByDate, date: string, time: string) => {
  return getClassSlotDay(classSlotsByDate, date).appointments.some(appointment => appointment.scheduledTime === time)
}

const toClassSlotLocationOption = (location: { meta?: Record<string, unknown> }) => {
  const label = typeof location.meta?.name === 'string' ? location.meta.name : null
  const value = typeof location.meta?.key === 'string' ? location.meta.key : null

  if (!label || !value) {
    return null
  }

  return {
    label,
    value,
  } satisfies ClassSlotLocationOption
}

export const useClassSlotLocations = () => {
  const { data: locations } = useAsyncData(
    'class-slot-locations',
    () => queryCollection('config').where('stem', 'LIKE', '%locations%').all(),
  )

  const locationOptions = computed<ClassSlotLocationOption[]>(() => {
    return locations.value?.flatMap((location) => {
      const option = toClassSlotLocationOption(location)

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

export const useClassSlotCalendar = (
  classSlots: Ref<ClassSlotItem[] | null | undefined>,
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

  const getClassSlots = async () => $fetch<ClassSlotItem[]>('/api/profile/class-slots', {
    credentials: 'include',
  })

  const saveClassSlot = async (classSlot: CreateClassSlotPayload) => $fetch<ClassSlotItem>('/api/profile/class-slots', {
    method: 'POST',
    credentials: 'include',
    body: classSlot,
  })

  const deleteClassSlot = async (classSlot: DeleteClassSlotPayload) => $fetch<ClassSlotMutationResult>('/api/profile/class-slots', {
    method: 'DELETE',
    credentials: 'include',
    body: classSlot,
  })

  const updateClassSlot = async (classSlot: UpdateClassSlotPayload) => $fetch<ClassSlotMutationResult>('/api/profile/class-slots', {
    method: 'PATCH',
    credentials: 'include',
    body: classSlot,
  })

  const useClassSlotData = () => useAsyncData(classSlotKey, getClassSlots)

  const getPublicClassSlots = async () => $fetch<ClassSlotItem[]>('/api/class-slots', {
    credentials: 'include',
  })

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
