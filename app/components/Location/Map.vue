<script setup lang="ts">
import type { LocationMapProps } from '~~/types/location'

const props = defineProps<LocationMapProps>()

const hasCoordinates = computed(() => {
  return Number.isFinite(props.latitude) && Number.isFinite(props.longitude)
})

const mapCenter = computed<[number, number]>(() => [
  Number(props.latitude),
  Number(props.longitude),
])

const mapHeight = computed(() => `${props.height ?? 420}px`)
</script>

<template lang="pug">
div(v-if="hasCoordinates" class="overflow-hidden rounded-[1.5rem] ring ring-default")
  ClientOnly
    template(#fallback)
      div(class="flex items-center justify-center bg-muted text-muted" :style="{ minHeight: mapHeight }") Cargando mapa...
    LMap(
      :zoom="zoom ?? 17"
      :center="mapCenter"
      :use-global-leaflet="false"
      :style="{ height: mapHeight, width: '100%' }"
    )
      LTileLayer(
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        layer-type="base"
        name="OpenStreetMap"
      )
      LMarker(:lat-lng="mapCenter")
        LPopup
          div(class="space-y-1")
            p(class="font-semibold") {{ name }}
            p(class="text-sm") {{ address }}
div(v-else class="flex items-center justify-center rounded-[1.5rem] bg-muted text-center text-muted" :style="{ minHeight: mapHeight }")
  p No hay coordenadas disponibles para mostrar el mapa de esta ubicación.
</template>
