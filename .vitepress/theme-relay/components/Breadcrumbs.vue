<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import { useSidebar } from "vitepress/theme";
import { findGroup, pagePath, plainText } from "../page-path";

const { theme, page } = useData();
const { sidebar } = useSidebar();

type NavLink = { text: string; link: string; activeMatch?: string };

const path = computed(() => pagePath(page.value.relativePath));
const tab = computed(() =>
  ((theme.value.nav || []) as NavLink[]).find(
    (it) => it.activeMatch && new RegExp(it.activeMatch).test(path.value)
  )
);
const group = computed(() => findGroup(sidebar.value, path.value));
</script>

<template>
  <nav v-if="tab" class="lr-breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li><a :href="tab.link">{{ tab.text }}</a></li>
      <li v-if="group" aria-current="location">{{ plainText(group.text ?? "") }}</li>
    </ol>
  </nav>
</template>
