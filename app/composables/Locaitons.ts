export const useLocations = () => {
    const getLocations = async () => await queryCollection('config').where('stem', 'LIKE', '%locations%').all()

    const getLocationByKey = async (key: string) => await queryCollection('config').where('stem', 'LIKE', `%locations/${key}%`).first()

    return {
        getLocations,
        getLocationByKey,
    }
}