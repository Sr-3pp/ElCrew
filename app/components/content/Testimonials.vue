<script setup lang="ts">
defineProps<{
    title: string
}>()

const testimonials = [
    {
        name: 'John Doe',
        title: 'CEO at Company',
        quote: 'This is an amazing product! It has changed the way we do business.',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
        name: 'Jane Smith',
        title: 'CTO at Organization',
        quote: 'I highly recommend this to anyone looking for a reliable solution.',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
]
</script>

<template lang="pug">
section(class="bg-muted")
    UContainer.py-16.flex.flex-col.gap-8
        h2.text-3xl.font-bold {{ title }}
        div(class="grid grid-cols-1 sm:grid-cols-2 gap-8")
            div(class="flex flex-col gap-8")
                UCard(variant="soft" v-for="(testimonial, index) in testimonials" :key="index")
                    p.mt-4 {{ testimonial.quote }}
                    div.flex.items-center.gap-4
                        NuxtImg(:src="testimonial.avatar" alt="Avatar" class="size-12 rounded-full")
                        div
                            h3.text-lg.font-bold {{ testimonial.name }}
                            p.text-sm.text-muted {{ testimonial.title }}
            div(class="flex flex-col gap-8")
                figure
                    NuxtImg(src="https://picsum.photos/800/600" alt="Testimonial Image" class="w-full h-full object-cover rounded-lg")
</template>