<script setup lang="ts">
const props = defineProps<{ cols?: number | string }>();
</script>

<template>
  <div class="lr-card-group" :style="{ '--lr-cols': String(cols || 2) }">
    <slot />
  </div>
</template>
