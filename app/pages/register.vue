

<script lang="ts" setup>
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
const registerSchema = v.pipe(
  v.object({
    username: v.pipe(
      v.string(),
      v.minLength(3, 'Username must be at least 3 characters')
    ),
    email: v.pipe(
      v.string(),
      v.email('Invalid email')
    ),
    password: v.pipe(
      v.string(),
      v.minLength(8, 'Password must be at least 8 characters')
    ),
    confirmPassword: v.string()
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'Passwords do not match'
    ),
    ['confirmPassword']
  )
)

type RegisterForm = v.InferInput<typeof registerSchema>

const state = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const { register } = useAuth()

const onSubmit = (event: FormSubmitEvent<RegisterForm>) => {
  const payload = {
    name: event.data.username,
    email: event.data.email,
    password: event.data.password,
    callbackURL: '/'
  }

  register(payload)
}
</script>

<template lang="pug">
section
  UContainer
    h1 Register
    p Create a new account.

    //- Use @submit (Nuxt UI handles prevent internally IF fields are linked correctly)
    UForm(:schema="registerSchema" :state="state" @submit="onSubmit")
      
      //- CRITICAL: 'name' must be on UFormField and match the state key
      UFormField(label="Username" name="username")
        UInput(v-model="state.username" placeholder="Enter your username")
      
      UFormField(label="Email" name="email")
        UInput(v-model="state.email" placeholder="Enter your email")
      
      UFormField(label="Password" name="password")
        UInput(v-model="state.password" type="password" placeholder="Enter your password")
      
      UFormField(label="Confirm Password" name="confirmPassword")
        UInput(v-model="state.confirmPassword" type="password" placeholder="Confirm your password")
      
      UButton(type="submit") Register
</template>