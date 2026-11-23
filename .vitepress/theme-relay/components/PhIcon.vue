<script setup lang="ts">
import { computed } from "vue";
import { icons } from "../icons";

const props = defineProps<{ name: string; label?: string }>();
const icon = computed(() => icons[props.name]);
</script>

<template>
  <svg
    v-if="icon"
    class="lr-ph"
    :viewBox="icon.viewBox"
    width="1em"
    height="1em"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    v-html="icon.body"
  />
</template>
