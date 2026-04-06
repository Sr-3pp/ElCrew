<script setup lang="ts">
import { parseContact, parseFavoriteTricks } from '~~/app/utils/teacher-util'

const route = useRoute()
const username = computed(() => String(route.params.username || ''))

const { getTeacherByUsername } = useTeachers()
const { toggleModal: toggleBookModal } = useModal('book')

const {
  data: teacher,
  pending,
  error,
} = await useAsyncData(
  () => `teacher-${username.value}`,
  () => getTeacherByUsername(username.value),
  {
    watch: [username],
  },
)

const teacherName = computed(() => {
  const currentTeacher = teacher.value

  if (!currentTeacher) {
    return ''
  }

  return [currentTeacher.name, currentTeacher.lastName].filter(Boolean).join(' ').trim() || currentTeacher.username
})

const teacherHeadline = computed(() => teacher.value?.areaOfFocus || 'Skateboarding y progresión técnica')
const teacherSummary = computed(() => teacher.value?.bio || teacher.value?.quote || 'Muy pronto podrás conocer más sobre esta instructora.')
const favoriteTricks = computed(() => parseFavoriteTricks(teacher.value?.favoriteTricks))
const contact = computed(() => parseContact(teacher.value?.contact))

const contactLinks = computed(() => {
  const currentContact = contact.value
  const links: Array<{ label: string, href: string, icon: string }> = []

  if (currentContact.whatsapp) {
    const normalizedPhone = currentContact.whatsapp.replace(/[^\d]/g, '')
    links.push({
      label: 'WhatsApp',
      href: `https://wa.me/${normalizedPhone}`,
      icon: 'i-ri-whatsapp-line',
    })
  }

  if (currentContact.instagram) {
    const handle = currentContact.instagram.replace(/^@/, '')
    links.push({
      label: 'Instagram',
      href: `https://instagram.com/${handle}`,
      icon: 'i-ri-instagram-line',
    })
  }

  if (currentContact.tiktok) {
    const handle = currentContact.tiktok.replace(/^@/, '')
    links.push({
      label: 'TikTok',
      href: `https://www.tiktok.com/@${handle}`,
      icon: 'i-ri-tiktok-line',
    })
  }

  return links
})

const teacherSinceLabel = computed(() => {
  if (!teacher.value?.createdAt) {
    return null
  }

  const year = new Date(teacher.value.createdAt).getFullYear()

  if (Number.isNaN(year)) {
    return null
  }

  return `En El Crew desde ${year}`
})

useSeoMeta({
  title: () => teacherName.value ? `${teacherName.value} | El Crew` : 'Instructora | El Crew',
  description: () => teacherSummary.value,
})
</script>

<template lang="pug">
section
  UContainer.py-16(v-if="pending")
    UCard(variant="soft" class="rounded-4xl")
      div(class="space-y-4 p-6")
        USkeleton(class="h-8 w-2/3")
        USkeleton(class="h-5 w-1/3")
        USkeleton(class="h-64 w-full rounded-3xl")

  UContainer.py-16(v-else-if="error || !teacher")
    UCard(variant="soft" class="rounded-4xl")
      div(class="space-y-4 p-8 text-center")
        h1(class="text-3xl font-bold") Instructora no encontrada
        p(class="text-muted") No pudimos cargar el perfil que estás buscando.
        UButton(to="/instructors" variant="outline") Volver a instructoras

  div(v-else)
    section(class="relative overflow-hidden")
      UContainer.py-16
        div(class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:items-stretch")
          div(class="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--ui-bg-elevated),var(--ui-bg-accented))] p-8 sm:p-10")
            div(class="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_top_right,var(--ui-secondary)_0,transparent_35%),radial-gradient(circle_at_bottom_left,var(--ui-primary)_0,transparent_40%)]")
            div(class="relative flex h-full flex-col gap-6")
              div(class="flex flex-wrap gap-3")
                UBadge(v-if="teacherHeadline" color="secondary" size="lg" variant="soft") {{ teacherHeadline }}
                UBadge(v-if="teacherSinceLabel" color="neutral" size="lg" variant="outline") {{ teacherSinceLabel }}
              div(class="space-y-4")
                p(class="text-sm font-semibold uppercase tracking-[0.3em] text-muted") Perfil de instructora
                h1(class="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl") {{ teacherName }}
                p(class="max-w-2xl text-lg leading-8 text-toned") {{ teacherSummary }}
              div(class="flex flex-wrap gap-3")
                UButton(color="secondary" size="lg" icon="i-lucide-calendar" @click="toggleBookModal()") Agenda una clase
                UButton(to="/instructors" color="neutral" variant="outline" size="lg") Ver más instructoras
              div(v-if="teacher.quote" class="mt-auto rounded-3xl bg-default/80 p-5 ring ring-default backdrop-blur")
                p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Frase
                p(class="mt-2 text-lg font-medium italic text-highlighted") "{{ teacher.quote }}"

          aside(class="flex h-full flex-col overflow-hidden rounded-[2rem] bg-default ring ring-default")
            div(class="aspect-[4/5] overflow-hidden bg-muted")
              NuxtImg(
                v-if="teacher.picture"
                :src="teacher.picture"
                :alt="teacherName"
                class="h-full w-full object-cover"
              )
              div(v-else class="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--ui-bg-muted),var(--ui-bg-accented))] p-8")
                div(class="text-center")
                  p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") El Crew
                  p(class="mt-3 text-2xl font-bold text-highlighted") {{ teacherName }}
            div(class="space-y-5 p-6")
              div
                p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Especialidad
                p(class="mt-2 text-lg font-semibold") {{ teacherHeadline }}
              div(v-if="contactLinks.length" class="space-y-3")
                p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Contacto
                div(class="flex flex-wrap gap-3")
                  UButton(
                    v-for="item in contactLinks"
                    :key="item.label"
                    :to="item.href"
                    target="_blank"
                    color="neutral"
                    variant="outline"
                    :icon="item.icon"
                  ) {{ item.label }}

    section
      UContainer(class="grid gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_360px]")
        UCard(class="rounded-[2rem]" variant="soft")
          template(#header)
            div(class="space-y-2")
              p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Sobre la instructora
              h2(class="text-2xl font-bold") Experiencia y estilo
          div(class="space-y-5")
            p(class="text-base leading-8 text-toned") {{ teacher.bio || 'Esta instructora sigue construyendo su perfil. Muy pronto compartiremos más sobre su experiencia, enfoque y trayectoria.' }}
            div(v-if="favoriteTricks.length" class="space-y-3")
              p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Trucos favoritos
              div(class="flex flex-wrap gap-2")
                UBadge(v-for="trick in favoriteTricks" :key="trick" color="primary" variant="soft" size="lg") {{ trick }}

        div(class="space-y-6")
          UCard(class="rounded-[2rem]" variant="outline")
            template(#header)
              h2(class="text-xl font-bold") Reserva tu lugar
            div(class="space-y-4")
              p(class="leading-7 text-toned") Si te interesa entrenar con {{ teacherName }}, agenda una clase y encuentra el horario que mejor te funcione.
              UButton(color="secondary" block icon="i-lucide-calendar" @click="toggleBookModal()") Programar clase

          UCard(v-if="contactLinks.length" class="rounded-[2rem]" variant="outline")
            template(#header)
              h2(class="text-xl font-bold") Redes y contacto
            ul(class="space-y-3")
              li(v-for="item in contactLinks" :key="item.label")
                UButton(:to="item.href" target="_blank" color="neutral" variant="ghost" :icon="item.icon") {{ item.label }}
</template>
