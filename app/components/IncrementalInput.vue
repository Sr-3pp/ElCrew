<script setup lang="ts">
const props = defineProps<{
    modelValue?: string[]
    addLabel?: string
    placeholder?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string[]]
}>()

const values = computed(() => props.modelValue ?? [])

const updateValue = (index: number, value: string) => {
    const nextValues = [...values.value]
    nextValues[index] = value
    emit('update:modelValue', nextValues)
}

const addValue = () => {
    emit('update:modelValue', [...values.value, ''])
}

const removeValue = (index: number) => {
    emit('update:modelValue', values.value.filter((_, currentIndex) => currentIndex !== index))
}
</script>

<template lang="pug">
.space-y-3.grid.grid-cols-2.gap-4
    .flex.gap-2.items-start(v-for="(value, index) in values" :key="index")
        UInput.flex-1(
            :model-value="value"
            :placeholder="placeholder"
            @update:model-value="updateValue(index, $event)"
        )
            template(v-if="value?.length" #trailing)
                UButton(
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="i-lucide-circle-x"
                    aria-label="Clear input"
                    @click="updateValue(index, '')"
                )
    UButton(
        class="col-start-2 justify-self-end"
        color="neutral"
        variant="outline"
        type="button"
        @click="addValue"
    ) {{ addLabel || 'Add item' }}
</template>
