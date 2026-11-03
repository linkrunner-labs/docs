<script setup lang="ts">
import PhIcon from "./PhIcon.vue";

defineProps<{ title: string; text: string; linkText: string; link: string }>();
</script>

<template>
  <aside class="lr-help" :aria-label="title">
    <div>
      <p class="lr-help__title"><span class="lr-square" aria-hidden="true"></span>{{ title }}</p>
      <p class="lr-help__text">{{ text }}</p>
    </div>
    <a class="lr-help__link" :href="link">{{ linkText }} <PhIcon name="arrow-right" /></a>
  </aside>
</template>
