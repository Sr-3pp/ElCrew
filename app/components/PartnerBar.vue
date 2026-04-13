<script setup lang="ts">
const partners = [
  { name: 'Partner 1', slug: 'partner-1', logo: 'https://picsum.photos/200/100?random=1' },
  { name: 'Partner 2', slug: 'partner-2', logo: 'https://picsum.photos/200/100?random=2' },
  { name: 'Partner 3', slug: 'partner-3', logo: 'https://picsum.photos/200/100?random=3' },
  { name: 'Partner 4', slug: 'partner-4', logo: 'https://picsum.photos/200/100?random=4' },
  { name: 'Partner 5', slug: 'partner-5', logo: 'https://picsum.photos/200/100?random=5' },
  { name: 'Partner 6', slug: 'partner-6', logo: 'https://picsum.photos/200/100?random=6' },
  { name: 'Partner 7', slug: 'partner-7', logo: 'https://picsum.photos/200/100?random=7' },
  { name: 'Partner 8', slug: 'partner-8', logo: 'https://picsum.photos/200/100?random=8' },
  { name: 'Partner 9', slug: 'partner-9', logo: 'https://picsum.photos/200/100?random=9' },
  { name: 'Partner 10', slug: 'partner-10', logo: 'https://picsum.photos/200/100?random=10' },
]

const { data: contentPartners, pending: contentPartnersPending, refresh: contentPartnersRefresh} = await useAsyncData('partners', () => queryCollection('partners').all())

const items = [
    ...contentPartners.value || [],
    ...partners,
    ...partners,
]
</script>

<template lang="pug">
section(class="w-full fixed bottom-0 bg-white/30 py-4 backdrop-blur-md shadow-md z-50")
    UCarousel(
        v-if="!contentPartnersPending"
        v-slot="{ item }"
        loop
        dots
        arrows
        :auto-scroll="{ stopOnMouseEnter: true, stopOnInteraction: false }"
        :items="items"
        :ui="{ item: 'basis-1/20 ps-0', container: 'gap-8 ps-8 items-center' }"
    )
        NuxtLink(:to="`/socios/${item.slug}`" :key="item.slug" class="flex items-center justify-center w-full")
            NuxtImg(:src="item.logo" width="234" height="234" class="rounded-lg" loading="lazy")
    div(v-else class="flex items-center justify-center h-16")
        p loading partners...
</template>