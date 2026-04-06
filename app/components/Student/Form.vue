<script setup lang="ts">
import * as v from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { Student, StudentFormState, StudentPayload } from '~~/types/student';
import type { Teacher } from '~~/types/teacher';

const props = defineProps<{
    student?: Student | null;
}>();

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

const { createStudent, updateStudent } = useStudents()
const { getTeachers } = useTeachers()
const { data: teachers } = useAsyncData<Teacher[]>('student-form-teachers', () => getTeachers())

const teacherOptions = computed(() => {
    return teachers.value?.map((teacher) => ({
        value: teacher.id,
        label: [teacher.name, teacher.lastName].filter(Boolean).join(' ').trim() || teacher.username,
    })) || []
})

const studentSchema = v.object({
    name: v.pipe(
      v.string(),
      v.minLength(3, 'El nombre debe tener al menos 3 caracteres')
    ),
    lastName: v.pipe(
      v.string(),
      v.minLength(3, 'Los apellidos deben tener al menos 3 caracteres')
    ),
    dob: v.pipe(
      v.string(),
            v.minLength(1, 'La fecha de nacimiento es obligatoria'),
            v.check(isValidDateInput, 'La fecha de nacimiento debe tener un formato válido AAAA-MM-DD')
    ),
    teacherId: v.pipe(
      v.string(),
      v.minLength(1, 'Debes seleccionar una maestra')
    ),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string())
})

const studentState = reactive<StudentFormState>({
    name: '',
    lastName: '',
    dob: '',
    teacherId: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
})

const emit = defineEmits<{
    saved: [];
}>()

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

const resetStudentState = () => {
    const contact = parseContact(props.student?.contact)

    studentState.name = props.student?.name || ''
    studentState.lastName = props.student?.lastName || ''
    studentState.dob = props.student?.dob || ''
    studentState.teacherId = props.student?.teacherId || ''
    studentState.whatsapp = contact.whatsapp
    studentState.instagram = contact.instagram
    studentState.tiktok = contact.tiktok
}

watch(
    () => props.student,
    () => resetStudentState(),
    { immediate: true }
)

const handleSubmit = async (event: FormSubmitEvent<StudentFormState>) => {
    try {
        const contactEntries = Object.entries({
            whatsapp: event.data.whatsapp.trim(),
            instagram: event.data.instagram.trim(),
            tiktok: event.data.tiktok.trim(),
        }).filter(([, value]) => value.length > 0)

        const payload: StudentPayload = {
            name: event.data.name,
            lastName: event.data.lastName,
            dob: event.data.dob,
            teacherId: event.data.teacherId,
            contact: contactEntries.length > 0 ? JSON.stringify(Object.fromEntries(contactEntries)) : undefined,
        }

        const result = props.student?.id
            ? await updateStudent(props.student.id, payload)
            : await createStudent(payload)

        if (!result) {
            return
        }

        emit('saved')

        if (!props.student?.id) {
            studentState.name = ''
            studentState.lastName = ''
            studentState.dob = ''
            studentState.teacherId = ''
            studentState.whatsapp = ''
            studentState.instagram = ''
            studentState.tiktok = ''
        }
    } catch (error) {
        console.error('Error al guardar la alumna:', error)
    }
}

</script>

<template lang="pug">
UForm(:schema="studentSchema" :state="studentState" @submit="handleSubmit")
    UFormField(label="Nombre" name="name")
        UInput(v-model="studentState.name")
    UFormField(label="Apellidos" name="lastName")
        UInput(v-model="studentState.lastName")
    UFormField(label="Fecha de nacimiento" name="dob")
        UInput(type="date" v-model="studentState.dob")
    UFormField(label="Maestra" name="teacherId")
        USelect(v-model="studentState.teacherId" :items="teacherOptions" placeholder="Selecciona una maestra")
    UFormField(label="WhatsApp" name="whatsapp")
        UInput(v-model="studentState.whatsapp")
    UFormField(label="Instagram" name="instagram")
        UInput(v-model="studentState.instagram")
    UFormField(label="TikTok" name="tiktok")
        UInput(v-model="studentState.tiktok")
    UButton(type="submit") {{ props.student?.id ? 'Guardar cambios' : 'Guardar' }}
</template>
