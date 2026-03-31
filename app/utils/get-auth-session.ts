import type { AuthSessionResponse } from '~~/types/auth'

export async function getAuthSession() {
  return await $fetch<AuthSessionResponse | null>('/api/auth/get-session', {
    headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
    credentials: 'include',
  })
}
