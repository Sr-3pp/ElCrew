import type { AuthSessionResponse, AuthUser, registerPayload, loginPayload } from '~~/types/auth'
import { authClient } from '~~/app/utils/auth-client'
import { getAuthSession } from '~~/app/utils/get-auth-session'

export const useAuth = () => {
  const session = useState<AuthUser | null>('session', () => null)

  const loadSession = async () => {
    return await getAuthSession()
  }
  
  const fetchSession = async () => {
    if (session.value) {
      return session.value
    }

    try {
      const response = await loadSession()
      if (response) {
        session.value = response.user
      }
      return session.value
    } catch (e) {
      throw new Error('Failed to fetch session', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }
  }

  const refreshSession = async () => {
    try {
      const response = await loadSession()
      session.value = response?.user ?? null
      return session.value
    } catch (e) {
      throw new Error('Failed to refresh session', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }
  }

  const login = async (payload: loginPayload) => {
    try {
      await authClient.signIn.email({
        email: payload.email,
        password: payload.password,
        callbackURL: payload.callbackURL,
      })

      const response = await loadSession()

      session.value = response?.user ?? null

      navigateTo('/')
    } catch (e) {
      throw new Error('Login failed', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }
  }

  const register = async (payload: registerPayload) => {

    try {
      await authClient.signUp.email({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        callbackURL: payload.callbackURL,
      })

      await $fetch('/api/profile/bootstrap', {
        method: 'POST',
        credentials: 'include',
      })

      const response = await loadSession()

      session.value = response?.user ?? null

      navigateTo('/')
    } catch (e) {
      throw new Error('Registration failed', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }

  }
   
  const logout = async () => {
    try {
      await authClient.signOut()

      session.value = null
    } catch (e) {
      throw new Error('Logout failed', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }
  }

  return {
    fetchSession,
    refreshSession,
    session,
    login,
    register,
    logout,
  }
}
