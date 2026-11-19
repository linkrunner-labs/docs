<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import PhIcon from "./PhIcon.vue";

// Optional "More to explore" links under the page outline, set per page with
// `moreLinks: [{ text, link }]` in frontmatter.
const { frontmatter } = useData();
const links = computed(() => (frontmatter.value.moreLinks || []) as { text: string; link: string }[]);
</script>

<template>
  <nav v-if="links.length" class="lr-more-links" aria-labelledby="lr-more-links-title">
    <p id="lr-more-links-title" class="lr-more-links__title">More to explore</p>
    <ul>
      <li v-for="l in links" :key="l.link">
        <a :href="l.link">{{ l.text }} <PhIcon name="arrow-right" /></a>
      </li>
    </ul>
  </nav>
</template>
