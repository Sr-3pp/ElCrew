

<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'

const registerSchema = v.pipe(
  v.object({
    username: v.pipe(
      v.string(),
      v.minLength(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    ),
    email: v.pipe(
      v.string(),
      v.email('Correo electrónico inválido')
    ),
    password: v.pipe(
      v.string(),
      v.minLength(8, 'La contraseña debe tener al menos 8 caracteres')
    ),
    confirmPassword: v.string(),
    isTeacher: v.boolean()
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'Las contraseñas no coinciden'
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
    h1 Registro
    p Crea una cuenta nueva.

    //- Use @submit (Nuxt UI handles prevent internally IF fields are linked correctly)
    UForm(:schema="registerSchema" :state="state" @submit="onSubmit" :ui="formUi")
      
      //- CRITICAL: 'name' must be on UFormField and match the state key
      UFormField(label="Nombre de usuario" name="username")
        UInput(v-model="state.username" placeholder="Escribe tu nombre de usuario" class="w-full")
      
      UFormField(label="Email" name="email")
        UInput(v-model="state.email" placeholder="Escribe tu correo electrónico" class="w-full")
      
      UFormField(label="Contraseña" name="password")
        UInput(v-model="state.password" type="password" placeholder="Escribe tu contraseña" class="w-full")
      
      UFormField(label="Confirmar contraseña" name="confirmPassword")
        UInput(v-model="state.confirmPassword" type="password" placeholder="Confirma tu contraseña" class="w-full")

      UFormField(name="isTeacher" class="col-span-full")
        UCheckbox(v-model="state.isTeacher" label="Soy maestra")
      
      UButton(type="submit" class="sm:col-start-2 sm:justify-self-end") Registrarme
</template>
