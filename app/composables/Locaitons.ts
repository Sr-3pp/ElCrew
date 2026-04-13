import type { ClassSlotLocationOption } from '~~/types/class-slot'
import type { LocationItem } from '~~/types/location'

const toLocationOption = (location: Pick<LocationItem, 'key' | 'name'>) => {
  if (!location.key || !location.name) {
    return null
  }

  return {
    label: location.name,
    value: location.key,
  } satisfies ClassSlotLocationOption
}

export const useLocations = () => {
    const getLocations = async () => await queryCollection('locations').all()

    const getLocationByKey = async (key: string) => await queryCollection('locations').where('key', 'LIKE', `%${key}%`).first()

    const { data: locations } = useAsyncData(
        'locations',
        () => getLocations(),
    )

    const locationOptions = computed<ClassSlotLocationOption[]>(() => {
        return locations.value?.flatMap((location) => {
            const option = toLocationOption(location)

            return option ? [option] : []
        }) ?? []
    })

    const getLocationLabel = (value: string) => {
        return locationOptions.value.find(option => option.value === value)?.label ?? value
    }

    return {
        getLocations,
        getLocationByKey,
        locations,
        locationOptions,
        getLocationLabel,
    }
}
