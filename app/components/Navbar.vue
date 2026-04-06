<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">

const {session, refreshSession, logout} = useAuth()

onMounted(() => {
  refreshSession()
})

const {data: navItems} = useAsyncData('navigation', async () => {
  const items = await queryCollectionNavigation('pages');

  return items.sort((a, b) => (a.order as number) - (b.order as number)).map(item => ({
    title: item.title,
    path: item.path
  }))
})

const authItems = computed(() => {
  const username = session.value?.username || session.value?.name || 'Usuario'
  const fullName = [session.value?.profile?.name, session.value?.profile?.lastName].filter(Boolean).join(' ')

  return [
    {
      label: 'Panel',
      icon: 'i-ri-dashboard-line',
      onSelect: () => navigateTo('/panel')
    },
    {
      label: 'Perfil',
      icon: 'i-ri-user-line',
      onSelect: () => navigateTo('/profile')
    },
    {
      label: 'Cerrar sesión',
      icon: 'i-ri-logout-box-line',
      onSelect: () => logout()
    },
    {
      label: username,
      avatar: {
        src: session.value?.profile?.picture || 'https://via.placeholder.com/150',
        alt: fullName || `Avatar de ${username}`,
        size: 'sm'
      },
    }
  ]
})

const { isOpen: bookModal, toggleModal: toggleBookModal } = useModal('book')
</script>

<template lang="pug">
header
  UContainer.py-4
    nav.flex.items-center.justify-between
      figure
        p logo here

      ul.flex.gap-4
        li(v-for="item in navItems" :key="`nav-item${item.label}`")
          NuxtLink(:to="item.path") {{ item.title }}
      div.flex.gap-4.items-center
        UButton(icon="i-lucide-calendar" color="neutral" size="sm" @click="toggleBookModal()") Programar Clase
        UDropdownMenu(v-if="session" :items="authItems" :ui="{ item: 'items-center'}")
          UButton(icon="i-lucide-menu" color="neutral" variant="outline")
        UButton(v-else @click="navigateTo('/login')") Iniciar sesión
</template>

<style scoped></style>
