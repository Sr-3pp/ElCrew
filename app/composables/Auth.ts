import type { AuthUser, registerPayload, loginPayload } from '~~/types/auth'
import { getAuthSession } from '~~/app/utils/get-auth-session'

export const useAuth = () => {
  const session = useState<AuthUser | null>('session', () => null)

  const authRequest = async (path: string, body?: Record<string, unknown>) => {
    return await $fetch(path, {
      method: 'POST',
      body,
      credentials: 'include',
    })
  }

  const syncSession = async () => {
    const response = await getAuthSession()
    session.value = response?.user ?? null
    return session.value
  }

  const fetchSession = async (options?: { force?: boolean }) => {
    if (!options?.force && session.value) {
      return session.value
    }

    try {
      return await syncSession()
    } catch (e) {
      throw new Error('Failed to fetch session', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }
  }

  const refreshSession = async () => {
    try {
      return await syncSession()
    } catch (e) {
      throw new Error('Failed to refresh session', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }
  }

  const login = async (payload: loginPayload) => {
    try {
      session.value = null

      await authRequest('/api/auth/sign-in/email', {
        email: payload.email,
        password: payload.password,
        callbackURL: payload.callbackURL,
      })

      const currentSession = await refreshSession()

      if (!currentSession) {
        throw new Error('Session was not created after login')
      }

      await navigateTo('/')
    } catch (e) {
      throw new Error('Login failed', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }
  }

  const register = async (payload: registerPayload) => {
    try {
      await authRequest('/api/auth/sign-up/email', {
        email: payload.email,
        password: payload.password,
        name: payload.username,
        username: payload.username,
        isTeacher: payload.isTeacher,
        callbackURL: payload.callbackURL,
      })

      await $fetch('/api/profile/bootstrap', {
        method: 'POST',
        credentials: 'include',
      })

      const currentSession = await refreshSession()

      if (!currentSession) {
        throw new Error('Session was not created after registration')
      }

      await navigateTo('/')
    } catch (e) {
      throw new Error('Registration failed', {
        cause: e instanceof Error ? e : new Error(String(e)),
      })
    }

  }
   
  const logout = async () => {
    try {
      await authRequest('/api/auth/sign-out')
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
