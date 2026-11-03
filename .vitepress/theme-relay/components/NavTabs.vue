<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import PhIcon from "./PhIcon.vue";
import { pagePath } from "../page-path";

// Section tabs in the top bar, right after the logo (960px and up). They are
// rendered before search in the page so keyboard order matches what you see;
// VitePress's own menu renders after search, so the theme CSS hides it.
// Below 960px the same links are in the sidebar drawer (SidebarTabs.vue).
const { theme, page } = useData();

type NavLink = { text: string; link: string; activeMatch?: string };
const items = computed(() => (theme.value.nav || []) as NavLink[]);
const current = computed(() => pagePath(page.value.relativePath));
const external = (link: string) => /^https?:/.test(link);
const isActive = (it: NavLink) => !!it.activeMatch && new RegExp(it.activeMatch).test(current.value);
</script>

<template>
  <nav class="lr-nav-tabs" aria-label="Sections">
    <a
      v-for="it in items"
      :key="it.text"
      :href="it.link"
      class="lr-nav-tab"
      :class="{ 'is-active': isActive(it) }"
      :aria-current="isActive(it) ? 'page' : undefined"
      :target="external(it.link) ? '_blank' : undefined"
      :rel="external(it.link) ? 'noreferrer' : undefined"
    >
      {{ it.text }}
      <PhIcon v-if="external(it.link)" name="arrow-up-right" />
    </a>
  </nav>
</template>
