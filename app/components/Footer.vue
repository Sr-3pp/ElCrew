<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { LocationSummary, NavigableLinkItem } from '~~/types/location'

const { toggleModal: toggleBookModal } = useModal('book')

const currentYear = new Date().getFullYear()

const { data: navItems } = useAsyncData('footer-navigation', async () => {
  const items = await queryCollectionNavigation('pages')

  return items
    .sort((a, b) => (a.order as number) - (b.order as number))
    .map(item => ({
      title: item.title,
      path: item.path,
    }))
})

const { getLocations } = useLocations()

const { data: locations } = useAsyncData('footer-locations', async () => {
  const items = await getLocations()

  return items.map((location): LocationSummary => ({
    key: String(location.key || ''),
    name: String(location.name || 'Ubicación'),
    address: String(location.address || ''),
  }))
})

const socialLinks: NavigableLinkItem[] = [
  {
    label: 'Instagram',
    icon: 'i-ri-instagram-line',
    to: '#',
  },
  {
    label: 'TikTok',
    icon: 'i-ri-tiktok-line',
    to: '#',
  },
  {
    label: 'WhatsApp',
    icon: 'i-ri-whatsapp-line',
    to: '#',
  },
]
</script>

<template lang="pug">
footer(class="relative mt-20 overflow-hidden border-t border-default bg-[linear-gradient(180deg,var(--ui-bg)_0%,var(--ui-bg-muted)_100%)]")
  div(class="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_top_left,var(--ui-secondary)_0,transparent_22%),radial-gradient(circle_at_bottom_right,var(--ui-primary)_0,transparent_28%)]")
  UContainer(class="relative py-16")
    div(class="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,1fr))]")
      div(class="space-y-5")
        div(class="space-y-3")
          p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Comunidad
          h3(class="text-2xl font-bold") Skate, progreso y comunidad real.
          p(class="max-w-md leading-7 text-toned") Creamos espacios para aprender con seguridad, técnica y estilo propio. Aquí siempre hay una siguiente línea por intentar.
        div(class="flex flex-wrap gap-3")
          UButton(
            v-for="item in socialLinks"
            :key="item.label"
            :to="item.to"
            color="neutral"
            variant="outline"
            :icon="item.icon"
          ) {{ item.label }}

      div(class="space-y-4")
        p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Navegación
        ul(class="space-y-3")
          li(v-for="item in navItems" :key="item.path")
            NuxtLink(:to="item.path" class="text-base font-medium text-highlighted transition hover:text-primary") {{ item.title }}

      div(class="space-y-4")
        p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Ubicaciones
        ul(class="space-y-4")
          li(v-for="location in locations" :key="location.key" class="space-y-1")
            NuxtLink(:to="`/ubicaciones/${location.key}`" class="block font-medium text-highlighted transition hover:text-primary") {{ location.name }}
            p(v-if="location.address" class="text-sm leading-6 text-toned") {{ location.address }}

      div(class="space-y-4")
        p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Próximo paso
        div(class="space-y-3 rounded-[1.5rem] bg-default/70 p-5 ring ring-default")
          p(class="font-semibold text-highlighted") ¿Lista para empezar?
          p(class="text-sm leading-6 text-toned") Reserva tu lugar, conoce la sede y llega con tiempo para rodar con calma.
          UButton(color="secondary" block class="justify-center" icon="i-lucide-arrow-right" @click="toggleBookModal()") Apartar lugar

    div(class="mt-10 flex flex-col gap-3 border-t border-default pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between")
      p &copy; {{ currentYear }} El Crew. Todos los derechos reservados.
      div(class="flex flex-wrap gap-4")
        NuxtLink(to="/about" class="transition hover:text-primary") Nosotros
        NuxtLink(to="/locations" class="transition hover:text-primary") Ubicaciones
</template>

<style scoped></style>
