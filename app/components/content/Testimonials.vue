<script setup lang="ts">
defineProps<{
    title: string
}>()

const testimonials = [
    {
        name: 'Mariana R.',
        title: 'Alumna de nivel intermedio',
        quote: 'Las clases me ayudaron a perder el miedo y a sentirme mucho más segura sobre la tabla.',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
        name: 'Sofía L.',
        title: 'Mamá de alumna',
        quote: 'El ambiente es cercano, profesional y muy seguro. Mi hija espera su clase cada semana.',
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
                        NuxtImg(:src="testimonial.avatar" alt="Avatar de testimonio" class="size-12 rounded-full")
                        div
                            h3.text-lg.font-bold {{ testimonial.name }}
                            p.text-sm.text-muted {{ testimonial.title }}
            div(class="flex flex-col gap-8")
                figure
                    NuxtImg(src="https://picsum.photos/800/600" alt="Imagen de alumnos entrenando" class="w-full h-full object-cover rounded-lg")
</template>
