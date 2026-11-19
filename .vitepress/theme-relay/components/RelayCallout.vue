<script setup lang="ts">
import PhIcon from "./PhIcon.vue";

// Relay version of the Note / Tip / Warning / Info callouts: status surface,
// Phosphor icon, and a visible label so meaning never relies on color alone.
const props = defineProps<{ type: "note" | "tip" | "warning" | "info" }>();
const META = {
  note: { icon: "info", label: "Note" },
  info: { icon: "info", label: "Info" },
  tip: { icon: "lightbulb", label: "Tip" },
  warning: { icon: "warning", label: "Warning" },
} as const;
</script>

<template>
  <div :class="['lr-callout', 'lr-callout-' + type]" role="note" :aria-label="META[type].label">
    <div class="lr-callout-icon"><PhIcon :name="META[type].icon" /></div>
    <div class="lr-callout-body"><slot /></div>
  </div>
</template>
