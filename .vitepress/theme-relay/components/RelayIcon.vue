<script setup lang="ts">
import { computed } from "vue";
import { iconSvg, isIconPath } from "../resolve-icon";

// Relay build's stand-in for theme/components/Icon.vue (swapped in by a Vite
// alias in config.ts): same props and output, Phosphor glyphs.
const props = defineProps<{ name?: string }>();

const isPath = computed(() => !!props.name && isIconPath(props.name));
const svg = computed(() => (!props.name || isPath.value ? null : iconSvg(props.name)));
</script>

<template>
  <img v-if="isPath" :src="name" class="lr-icon-img" alt="" />
  <svg
    v-else-if="svg"
    class="lr-icon"
    :viewBox="svg.viewBox"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
    v-html="svg.body"
  />
</template>
