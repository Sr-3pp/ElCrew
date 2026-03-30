<script setup lang="ts">
import * as v from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { Teacher, TeacherPayload } from '~~/types/teacher';

type TeacherFormState = Omit<TeacherPayload, 'contact'> & {
    whatsapp: string;
    instagram: string;
    tiktok: string;
};

const props = defineProps<{
    teacher?: Teacher | null;
}>();

const emit = defineEmits<{
    saved: [];
}>();

const { createTeacher, updateTeacher } = useTeachers();

const PASSWORD_LENGTH = 16;
const PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';

const isValidDateInput = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

    if (!match) {
        return false
    }

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(Date.UTC(year, month - 1, day))

    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day
}

const teacherSchema = v.object({
    username: v.pipe(
      v.string(),
      v.minLength(3, 'Username must be at least 3 characters')
    ),
    email: v.pipe(
      v.string(),
      v.email('Invalid email')
    ),
    password: v.optional(v.string()),
    name: v.pipe(
      v.string(),
      v.minLength(2, 'Name must be at least 2 characters')
    ),
    lastName: v.pipe(
      v.string(),
      v.minLength(3, 'Last name must be at least 3 characters')
    ),
    dob: v.pipe(
      v.string(),
      v.minLength(1, 'Date of birth is required'),
      v.check(isValidDateInput, 'Date of birth must be a valid YYYY-MM-DD date')
    ),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string())
})

const teacherState = reactive<TeacherFormState>({
    username: '',
    email: '',
    password: '',
    name: '',
    lastName: '',
    dob: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
})

const parseContact = (contact: string | null | undefined) => {
    if (!contact) {
        return {
            whatsapp: '',
            instagram: '',
            tiktok: '',
        }
    }

    try {
        const parsed = JSON.parse(contact) as Record<string, unknown>

        return {
            whatsapp: typeof parsed.whatsapp === 'string' ? parsed.whatsapp : '',
            instagram: typeof parsed.instagram === 'string' ? parsed.instagram : '',
            tiktok: typeof parsed.tiktok === 'string' ? parsed.tiktok : '',
        }
    } catch {
        return {
            whatsapp: '',
            instagram: '',
            tiktok: '',
        }
    }
}

const resetTeacherState = () => {
    const contact = parseContact(props.teacher?.contact)

    teacherState.username = props.teacher?.username || ''
    teacherState.email = props.teacher?.email || ''
    teacherState.password = ''
    teacherState.name = props.teacher?.name || ''
    teacherState.lastName = props.teacher?.lastName || ''
    teacherState.dob = props.teacher?.dob || ''
    teacherState.whatsapp = contact.whatsapp
    teacherState.instagram = contact.instagram
    teacherState.tiktok = contact.tiktok
}

watch(
    () => props.teacher,
    () => resetTeacherState(),
    { immediate: true }
)

const generateStrongPassword = () => {
    const values = new Uint32Array(PASSWORD_LENGTH)
    crypto.getRandomValues(values)

    teacherState.password = Array.from(values, (value) => {
        const index = value % PASSWORD_ALPHABET.length
        return PASSWORD_ALPHABET[index]
    }).join('')
}

const handleSubmit = async (event: FormSubmitEvent<TeacherFormState>) => {
    try {
        if (!props.teacher?.id && (!event.data.password || event.data.password.length < 8)) {
            return
        }

        const contactEntries = Object.entries({
            whatsapp: event.data.whatsapp.trim(),
            instagram: event.data.instagram.trim(),
            tiktok: event.data.tiktok.trim(),
        }).filter(([, value]) => value.length > 0)

        const payload: TeacherPayload = {
            username: event.data.username,
            email: event.data.email,
            password: event.data.password,
            name: event.data.name,
            lastName: event.data.lastName,
            dob: event.data.dob,
            contact: contactEntries.length > 0 ? JSON.stringify(Object.fromEntries(contactEntries)) : undefined,
        }

        const result = props.teacher?.id
            ? await updateTeacher(props.teacher.id, payload)
            : await createTeacher(payload)

        if (!result) {
            return
        }

        emit('saved')

        if (!props.teacher?.id) {
            teacherState.username = ''
            teacherState.email = ''
            teacherState.password = ''
            teacherState.name = ''
            teacherState.lastName = ''
            teacherState.dob = ''
            teacherState.whatsapp = ''
            teacherState.instagram = ''
            teacherState.tiktok = ''
        }
    } catch (error) {
        console.error('Error adding teacher:', error)
    }
}

</script>


<template lang="pug">
UForm(:schema="teacherSchema" :state="teacherState" @submit="handleSubmit")
    UFormField(label="Username" name="username")
        UInput(v-model="teacherState.username")
    UFormField(label="Email" name="email")
        UInput(v-model="teacherState.email" type="email")
    UFormField(v-if="!props.teacher?.id" label="Password" name="password")
        .flex.gap-2
            UInput.flex-1(v-model="teacherState.password" type="text")
            UButton(color="neutral" variant="outline" type="button" @click="generateStrongPassword") Generate
    UFormField(label="Name" name="name")
        UInput(v-model="teacherState.name")
    UFormField(label="Last Name" name="lastName")
        UInput(v-model="teacherState.lastName")
    UFormField(label="Date of Birth" name="dob")
        UInput(v-model="teacherState.dob" type="date")
    UFormField(label="WhatsApp" name="whatsapp")
        UInput(v-model="teacherState.whatsapp")
    UFormField(label="Instagram" name="instagram")
        UInput(v-model="teacherState.instagram")
    UFormField(label="TikTok" name="tiktok")
        UInput(v-model="teacherState.tiktok")
    UButton(type="submit") {{ props.teacher?.id ? 'Save Changes' : 'Submit' }}
</template>
