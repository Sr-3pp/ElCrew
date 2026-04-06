<script setup lang="ts">
const route = useRoute()
const key = computed(() => String(route.params.key || ''))

const { getLocationByKey } = useLocations()
const { toggleModal: toggleBookModal } = useModal('book')

const {
  data: location,
  pending,
  error,
} = await useAsyncData(
  () => `location-${key.value}`,
  () => getLocationByKey(key.value),
  {
    watch: [key],
  },
)

const locationName = computed(() => location.value?.name || 'Ubicación El Crew')
const locationDescription = computed(() => location.value?.description || 'Muy pronto podrás conocer más sobre esta ubicación.')
const locationAddress = computed(() => location.value?.address || 'Dirección no disponible')
const latitude = computed(() => Number(location.value?.coordinates?.latitude))
const longitude = computed(() => Number(location.value?.coordinates?.longitude))

const hasCoordinates = computed(() => Number.isFinite(latitude.value) && Number.isFinite(longitude.value))

const mapsLink = computed(() => {
  if (!hasCoordinates.value) {
    return null
  }

  return `https://www.google.com/maps/search/?api=1&query=${latitude.value},${longitude.value}`
})

useSeoMeta({
  title: () => `${locationName.value} | El Crew`,
  description: () => locationDescription.value,
})
</script>

<template lang="pug">
section
  UContainer.py-16(v-if="pending")
    UCard(variant="soft" class="rounded-[2rem]")
      div(class="space-y-4 p-6")
        USkeleton(class="h-10 w-2/3")
        USkeleton(class="h-5 w-1/2")
        USkeleton(class="h-80 w-full rounded-[1.5rem]")

  UContainer.py-16(v-else-if="error || !location")
    UCard(variant="soft" class="rounded-[2rem]")
      div(class="space-y-4 p-8 text-center")
        h1(class="text-3xl font-bold") Ubicación no encontrada
        p(class="text-muted") No pudimos cargar la ubicación que estás buscando.
        UButton(to="/locations" variant="outline") Volver a ubicaciones

  div(v-else)
    section
      UContainer.py-16
        div(class="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_420px] lg:items-stretch")
          div(class="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--ui-bg-elevated),var(--ui-bg-accented))] p-8 sm:p-10")
            div(class="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_top_left,var(--ui-secondary)_0,transparent_35%),radial-gradient(circle_at_bottom_right,var(--ui-primary)_0,transparent_38%)]")
            div(class="relative flex h-full flex-col gap-6")
              UBadge(color="warning" size="lg" variant="soft") Sede El Crew
              div(class="space-y-4")
                p(class="text-sm font-semibold uppercase tracking-[0.3em] text-muted") Ubicación
                h1(class="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl") {{ locationName }}
                p(class="max-w-2xl text-lg leading-8 text-toned") {{ locationDescription }}
              div(class="rounded-[1.5rem] bg-default/85 p-5 ring ring-default backdrop-blur")
                p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Dirección
                p(class="mt-2 text-lg font-semibold text-highlighted") {{ locationAddress }}
              div(class="flex flex-wrap gap-3")
                UButton(v-if="mapsLink" :to="mapsLink" target="_blank" color="secondary" size="lg" icon="i-lucide-map-pinned") Cómo llegar
                UButton(color="neutral" variant="outline" size="lg" icon="i-lucide-calendar" @click="toggleBookModal()") Reservar clase

          aside(class="overflow-hidden rounded-[2rem] bg-default ring ring-default")
            div(class="aspect-[4/5] overflow-hidden bg-muted")
              NuxtImg(
                v-if="location.picture"
                :src="location.picture"
                :alt="locationName"
                class="h-full w-full object-cover"
              )
              div(v-else class="flex h-full items-center justify-center bg-[linear-gradient(135deg,var(--ui-bg-muted),var(--ui-bg-accented))] p-8")
                p(class="text-center text-2xl font-bold text-highlighted") {{ locationName }}
            div(class="space-y-4 p-6")
              div
                p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Ambiente
                p(class="mt-2 leading-7 text-toned") Ideal para sesiones, clases y progresión técnica con la vibra de calle de El Crew.

    section
      UContainer(class="grid gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_320px]")
        UCard(class="overflow-hidden rounded-[2rem]" variant="soft")
          template(#header)
            div(class="space-y-2")
              p(class="text-sm font-semibold uppercase tracking-[0.25em] text-muted") Mapa
              h2(class="text-2xl font-bold") Ubícala rápido
          LocationMap(
            :latitude="latitude"
            :longitude="longitude"
            :name="locationName"
            :address="locationAddress"
            :height="420"
          )

        div(class="space-y-6")
          UCard(class="rounded-[2rem]" variant="outline")
            template(#header)
              h2(class="text-xl font-bold") Antes de ir
            ul(class="space-y-3 text-toned")
              li Lleva tabla, agua y protección si estás empezando.
              li Llega unos minutos antes para ubicarte con calma.
              li Si quieres apartar tu lugar, usa el botón de reservación.

          UCard(v-if="mapsLink" class="rounded-[2rem]" variant="outline")
            template(#header)
              h2(class="text-xl font-bold") Navegación
            div(class="space-y-4")
              p(class="leading-7 text-toned") Abre la ruta en tu app de mapas y llega directo a la sede.
              UButton(:to="mapsLink" target="_blank" color="secondary" icon="i-lucide-navigation" class="w-full justify-center") Abrir en Google Maps
</template>
