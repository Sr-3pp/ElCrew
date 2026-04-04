<script setup lang="ts">
import * as v from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { Teacher, TeacherFormState, TeacherPayload } from '~~/types/teacher';
import { generatePassword } from '~~/app/utils/generate-password';
import { parseContact, parseFavoriteTricks } from '~~/app/utils/teacher-util';

const props = defineProps<{
    teacher?: Teacher | null;
    submitTeacher?: (payload: TeacherPayload, teacher?: Teacher | null) => Promise<Teacher | null | undefined>;
}>();

const emit = defineEmits<{
    saved: [];
}>();

const { createTeacher, updateTeacher } = useTeachers();

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
    quote: v.optional(v.string()),
    bio: v.optional(v.string()),
    favoriteTricks: v.optional(v.array(v.string())),
    areaOfFocus: v.optional(v.string()),
    picture: v.optional(v.unknown()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tiktok: v.optional(v.string())
})

const teacherState = reactive<TeacherFormState>({
    picture: null,
    username: '',
    email: '',
    password: '',
    name: '',
    lastName: '',
    dob: '',
    quote: '',
    bio: '',
    favoriteTricks: [],
    areaOfFocus: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
})

const resetTeacherState = () => {
    const contact = parseContact(props.teacher?.contact)

    teacherState.username = props.teacher?.username || ''
    teacherState.email = props.teacher?.email || ''
    teacherState.password = ''
    teacherState.picture = null
    teacherState.name = props.teacher?.name || ''
    teacherState.lastName = props.teacher?.lastName || ''
    teacherState.dob = props.teacher?.dob || ''
    teacherState.quote = props.teacher?.quote || ''
    teacherState.bio = props.teacher?.bio || ''
    teacherState.favoriteTricks = parseFavoriteTricks(props.teacher?.favoriteTricks)
    teacherState.areaOfFocus = props.teacher?.areaOfFocus || ''
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
    teacherState.password = generatePassword()
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

        const favoriteTricks = event.data.favoriteTricks
            .map(value => value.trim())
            .filter(Boolean)

        const payload: TeacherPayload = {
            username: event.data.username,
            email: event.data.email,
            password: event.data.password,
            picture: event.data.picture,
            name: event.data.name,
            lastName: event.data.lastName,
            dob: event.data.dob,
            quote: event.data.quote.trim() || undefined,
            bio: event.data.bio.trim() || undefined,
            favoriteTricks: favoriteTricks.length ? favoriteTricks.join(',') : undefined,
            areaOfFocus: event.data.areaOfFocus.trim() || undefined,
            contact: contactEntries.length > 0 ? JSON.stringify(Object.fromEntries(contactEntries)) : undefined,
        }

        const result = props.submitTeacher
            ? await props.submitTeacher(payload, props.teacher)
            : props.teacher?.id
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
            teacherState.picture = null
            teacherState.name = ''
            teacherState.lastName = ''
            teacherState.dob = ''
            teacherState.quote = ''
            teacherState.bio = ''
            teacherState.favoriteTricks = []
            teacherState.areaOfFocus = ''
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
UForm(:schema="teacherSchema" :state="teacherState" @submit="handleSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-6")
    UFormField(label="Picture" name="picture" class="col-span-full")
        UFileUpload(v-model="teacherState.picture" :preview="true" accept="image/*")
    UFormField(label="Username" name="username")
        UInput(v-model="teacherState.username" class="w-full")
    UFormField(label="Email" name="email")
        UInput(v-model="teacherState.email" type="email" class="w-full")
    UFormField(v-if="!props.teacher?.id" label="Password" name="password")
        .flex.gap-2
            UInput.flex-1(v-model="teacherState.password" type="text" class="w-full")
            UButton(color="neutral" variant="outline" type="button" @click="generateStrongPassword") Generate
    UFormField(label="Name" name="name")
        UInput(v-model="teacherState.name" class="w-full")
    UFormField(label="Last Name" name="lastName")
        UInput(v-model="teacherState.lastName" class="w-full")
    UFormField(label="Date of Birth" name="dob")
        UInput(v-model="teacherState.dob" type="date" class="w-full")
    UFormField(label="Quote" name="quote" class="col-span-full")
        UTextarea(v-model="teacherState.quote" class="w-full" placeholder="Inspiring quote to attract students")
    UFormField(label="Bio" name="bio" class="col-span-full")
        UTextarea(v-model="teacherState.bio" class="w-full" placeholder="Short biography")
    UFormField(label="Favorite Tricks" name="favoriteTricks" class="col-span-full")
        IncrementalInput(
            v-model="teacherState.favoriteTricks"
            add-label="Add trick"
            placeholder="Windmill"
        )
    UFormField(label="Area of Focus" name="areaOfFocus")
        UInput(v-model="teacherState.areaOfFocus" class="w-full")
    UFormField(label="WhatsApp" name="whatsapp")
        UInput(v-model="teacherState.whatsapp" class="w-full")
    UFormField(label="Instagram" name="instagram")
        UInput(v-model="teacherState.instagram" class="w-full")
    UFormField(label="TikTok" name="tiktok")
        UInput(v-model="teacherState.tiktok" class="w-full")
    UButton(type="submit" class="sm:col-start-2 sm:justify-self-end") {{ props.teacher?.id ? 'Save Changes' : 'Submit' }}
</template>
