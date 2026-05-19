type ApiFetchOptions = NonNullable<Parameters<typeof $fetch>[1]>

export const apiFetch = <T>(request: Parameters<typeof $fetch<T>>[0], options: ApiFetchOptions = {}) => {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  return $fetch<T>(request, {
    credentials: 'include',
    headers,
    ...options,
  })
}
