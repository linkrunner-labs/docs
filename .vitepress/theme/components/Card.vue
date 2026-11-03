<script setup lang="ts">
import { computed } from "vue";
import Icon from "./Icon.vue";

const props = defineProps<{
  title?: string;
  icon?: string;
  href?: string;
  horizontal?: boolean | string;
}>();

const isExternal = computed(() => !!props.href && /^(https?:|mailto:)/.test(props.href));
const tag = computed(() => (props.href ? "a" : "div"));
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noreferrer' : undefined"
    :class="['lr-card', { 'lr-card--link': href, 'lr-card--h': horizontal === true || horizontal === '' }]"
  >
    <Icon v-if="icon" :name="icon" class="lr-card__icon" />
    <div class="lr-card__body">
      <p v-if="title" class="lr-card__title">{{ title }}</p>
      <div class="lr-card__content"><slot /></div>
    </div>
  </component>
</template>
