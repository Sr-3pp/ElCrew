import type { AuthSessionResponse } from '~~/types/auth'
import { authClient } from '~~/app/utils/auth-client'

export async function getAuthSession() {
  if (import.meta.server) {
    return await $fetch<AuthSessionResponse | null>('/api/auth/get-session', {
      headers: useRequestHeaders(['cookie']),
    })
  }

  const response = await authClient.getSession()
  return response.data as AuthSessionResponse | null
}
