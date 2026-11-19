<script setup lang="ts">
const props = defineProps<{ caption?: string }>();
</script>

<template>
  <figure class="lr-frame">
    <div class="lr-frame__inner"><slot /></div>
    <figcaption v-if="caption" class="lr-frame__caption">{{ caption }}</figcaption>
  </figure>
</template>
