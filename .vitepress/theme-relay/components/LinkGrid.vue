<script setup lang="ts">
import { withBase } from "vitepress";
import PhIcon from "./PhIcon.vue";

defineProps<{ items: { text: string; link: string; detail?: string }[]; compact?: boolean }>();
</script>

<template>
  <ul :class="['lr-link-grid', { 'lr-link-grid--compact': compact }]" role="list">
    <li v-for="it in items" :key="it.link">
      <a :href="withBase(it.link)">
        <span class="lr-link-grid__text">
          <span class="lr-link-grid__title">{{ it.text }}</span>
          <span v-if="it.detail" class="lr-link-grid__detail">{{ it.detail }}</span>
        </span>
        <PhIcon name="arrow-right" />
      </a>
    </li>
  </ul>
</template>
