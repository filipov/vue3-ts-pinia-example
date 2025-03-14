<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  values: {
    type: Array<Record<'value' | 'name', string>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const handleInput = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    emit('update:modelValue', event.target.value);
  }
};
</script>

<template>
  <select
    class="input"
    :value="modelValue"
    @input="handleInput"
    @change="(event) => emit('change', event)"
  >
    <option v-for="({ value, name }, index) in values" :key="index" :value="value">
      {{ name }}
    </option>
  </select>
</template>
