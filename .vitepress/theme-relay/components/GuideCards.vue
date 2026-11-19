<script setup lang="ts">
import { withBase } from "vitepress";
import PhIcon from "./PhIcon.vue";

defineProps<{ items: { title: string; text: string; tag: string; link: string }[] }>();
</script>

<template>
  <ul class="lr-guide-cards" role="list">
    <li v-for="(it, i) in items" :key="it.link">
      <a class="lr-guide-card" :href="withBase(it.link)">
        <span class="lr-guide-card__top">
          <span class="lr-guide-card__num" aria-hidden="true">{{ String(i + 1).padStart(2, "0") }}</span>
          <PhIcon name="arrow-up-right" />
        </span>
        <span class="lr-guide-card__title">{{ it.title }}</span>
        <span class="lr-guide-card__text">{{ it.text }}</span>
        <span class="lr-guide-card__tag">{{ it.tag }}</span>
      </a>
    </li>
  </ul>
</template>
