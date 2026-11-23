<script setup lang="ts">
import Icon from "./Icon.vue";

const props = defineProps<{ type: "note" | "tip" | "warning" | "info" }>();

const ICONS: Record<string, string> = {
  note: "circle-info",
  tip: "lightbulb",
  warning: "triangle-exclamation",
  info: "circle-info",
};
</script>

<template>
  <div :class="['lr-callout', 'lr-callout-' + type]">
    <div class="lr-callout-icon"><Icon :name="ICONS[type]" /></div>
    <div class="lr-callout-body"><slot /></div>
  </div>
</template>
