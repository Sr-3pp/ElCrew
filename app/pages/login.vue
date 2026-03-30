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
    label: 'Password'
  }
])

const { login } = useAuth()

const onSubmit = (event: FormSubmitEvent<{ email: string; password: string }>) => {
  const payload = {
    email: event.data.email,
    password: event.data.password,
    callbackURL: '/'
  }

  login(payload)
}
</script>

<template lang="pug">
  UContainer.flex.flex-col.items-center.justify-center.py-10
    UAuthForm(@submit="onSubmit" title="Login" :fields="fields" class="max-w-md")
</template>