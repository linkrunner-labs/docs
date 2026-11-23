<script setup lang="ts">
const props = defineProps<{ title?: string; icon?: string }>();
</script>

<template>
  <div class="lr-step">
    <div class="lr-step__content">
      <p v-if="title" class="lr-step__title">{{ title }}</p>
      <slot />
    </div>
  </div>
</template>
