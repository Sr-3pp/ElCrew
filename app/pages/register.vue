

<script setup lang="ts">
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
    confirmPassword: v.string(),
    isTeacher: v.boolean()
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
  confirmPassword: '',
  isTeacher: false
})

const { register } = useAuth()

const onSubmit = (event: FormSubmitEvent<RegisterForm>) => {
  const payload = {
    username: event.data.username,
    email: event.data.email,
    password: event.data.password,
    isTeacher: event.data.isTeacher,
    callbackURL: '/'
  }

  register(payload)
}

const formUi = {
  base: 'grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto',
}
</script>

<template lang="pug">
section
  UContainer
    h1 Register
    p Create a new account.

    //- Use @submit (Nuxt UI handles prevent internally IF fields are linked correctly)
    UForm(:schema="registerSchema" :state="state" @submit="onSubmit" :ui="formUi")
      
      //- CRITICAL: 'name' must be on UFormField and match the state key
      UFormField(label="Username" name="username")
        UInput(v-model="state.username" placeholder="Enter your username" class="w-full")
      
      UFormField(label="Email" name="email")
        UInput(v-model="state.email" placeholder="Enter your email" class="w-full")
      
      UFormField(label="Password" name="password")
        UInput(v-model="state.password" type="password" placeholder="Enter your password" class="w-full")
      
      UFormField(label="Confirm Password" name="confirmPassword")
        UInput(v-model="state.confirmPassword" type="password" placeholder="Confirm your password" class="w-full")

      UFormField(name="isTeacher" class="col-span-full")
        UCheckbox(v-model="state.isTeacher" label="I'm a teacher")
      
      UButton(type="submit" class="sm:col-start-2 sm:justify-self-end") Register
</template>
