export const useLocations = () => {
    const getLocations = async () => await queryCollection('locations').all()

    const getLocationByKey = async (key: string) => await queryCollection('locations').where('key', 'LIKE', `%${key}%`).first()

    return {
        getLocations,
        getLocationByKey,
    }
}