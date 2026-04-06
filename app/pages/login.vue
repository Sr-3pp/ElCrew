<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

const fields = ref<AuthFormField[]>([
  {
    name: 'email',
    type: 'text',
    label: 'Email'
  },
  {
    name: 'password',
    type: 'password',
    label: 'Contraseña'
  }
])

const { login } = useAuth()
const errorMessage = ref<string | null>(null)

const onSubmit = async (event: FormSubmitEvent<{ email: string; password: string }>) => {
  errorMessage.value = null

  const payload = {
    email: event.data.email,
    password: event.data.password,
    callbackURL: '/'
  }

  try {
    await login(payload)
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.cause instanceof Error
        ? error.cause.message
        : error.message
      : 'No se pudo iniciar sesión'
  }
}
</script>

<template lang="pug">
  UContainer.flex.flex-col.items-center.justify-center.py-10
    UAuthForm(@submit="onSubmit" title="Iniciar sesión" :fields="fields" class="max-w-md w-full")
    p.mt-3.text-sm.text-red-600(v-if="errorMessage") {{ errorMessage }}
    p.mt-4.text-sm.text-gray-600
      | ¿Todavía no tienes cuenta?
      NuxtLink(to="/register" class="ml-1 text-primary font-medium hover:underline") Regístrate
</template>
