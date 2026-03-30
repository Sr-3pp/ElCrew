export default defineNuxtRouteMiddleware(async (to) => {
    const { session, fetchSession } = useAuth()
    await fetchSession()

    if (to.path.includes('panel') && (!session.value || !session.value.isAdmin)) {
        return navigateTo('/login')
    }
})
