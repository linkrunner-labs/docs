<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import PhIcon from "./PhIcon.vue";
import data from "../../relay-before-you-start.json";
import { pagePath } from "../page-path";

type Entry = { for: string; needs: string[]; time: string };

// Added under the intro of pages listed in relay-before-you-start.json (see
// relay-markdown.ts): who the page is for, what to have ready, how long it takes.
const { page } = useData();
const entry = computed(() => (data as Record<string, Entry>)[pagePath(page.value.relativePath)]);
</script>

<template>
  <aside v-if="entry" class="lr-before" aria-label="Before you start">
    <p class="lr-before__title">Before you start</p>
    <dl class="lr-before__facts">
      <div>
        <dt><PhIcon name="users-three" /> For</dt>
        <dd>{{ entry.for }}</dd>
      </div>
      <div>
        <dt><PhIcon name="clock" /> Time</dt>
        <dd>{{ entry.time }}</dd>
      </div>
    </dl>
    <p class="lr-before__label">You need</p>
    <ul class="lr-before__needs">
      <li v-for="n in entry.needs" :key="n">{{ n }}</li>
    </ul>
  </aside>
</template>
