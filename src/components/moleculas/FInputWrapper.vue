<script setup lang="ts">
import { computed } from 'vue';

const { name } = defineProps({
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const id = computed(() => `${name}-${Math.random()}`);
</script>

<template>
  <label class="input-wrapper" :for="id">
    <span class="input-wrapper__label">
      {{ label }}
    </span>
    <slot :id="id" />
  </label>
</template>

<style scoped lang="scss">
.input-wrapper {
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;

  &:has(input:invalid) {
    color: var(--color-error);
  }

  &__label {
    cursor: pointer;
  }
}
</style>
