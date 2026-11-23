<script setup lang="ts">
import Icon from "./Icon.vue";

const props = defineProps<{
  title?: string;
  icon?: string;
  defaultOpen?: boolean | string;
  /** Mintlify's id for this entry (legacy-anchors.ts). */
  anchor?: string;
}>();

const open = props.defaultOpen === true || props.defaultOpen === "" || props.defaultOpen === "true";
</script>

<template>
  <details :id="anchor" class="lr-accordion" :open="open">
    <summary class="lr-accordion__summary">
      <Icon v-if="icon" :name="icon" class="lr-accordion__icon" />
      <span class="lr-accordion__title">{{ title }}</span>
      <Icon name="chevron-right" class="lr-accordion__chevron" />
    </summary>
    <div class="lr-accordion__body"><slot /></div>
  </details>
</template>
