<script setup lang="ts">
import { computed } from "vue";
import faSolid from "@iconify-json/fa6-solid/icons.json";
import faBrands from "@iconify-json/fa6-brands/icons.json";
import { getIconData, iconToSVG } from "@iconify/utils";
import type { IconifyJSON } from "@iconify/types";

const props = defineProps<{ name?: string }>();

// Mintlify uses Font Awesome names; brands live in fa6-brands, the rest in
// fa6-solid. Resolved synchronously so icons render correctly during SSR.
const BRANDS = new Set([
  "apple", "android", "react", "flutter", "unity", "google", "meta", "facebook",
  "instagram", "tiktok", "snapchat", "linkedin", "linkedin-in", "github", "x-twitter",
  "twitter", "node-js", "npm", "js", "java", "swift", "python", "php", "vuejs",
  "angular", "aws", "google-play", "app-store-ios", "shopify", "stripe", "slack",
]);

// Map Font Awesome Pro names to their free-set equivalents.
const ALIAS: Record<string, string> = {
  "circle-dollar": "sack-dollar",
  "chart-mixed": "chart-line",
  "chart-line-down": "chart-line",
  "mobile-screen": "mobile-screen-button",
  "hand-pointer": "arrow-pointer",
  "link-simple": "link",
  // Not in the free set; substitute close free equivalents.
  "sparkles": "wand-magic-sparkles",
  "webhook": "plug",
};

const isPath = computed(
  () => !!props.name && (/^(\/|https?:)/.test(props.name) || /\.(svg|png|webp|jpe?g)$/i.test(props.name))
);

const svg = computed(() => {
  if (!props.name || isPath.value) return null;
  let n = props.name.trim().replace(/^fa[a-z]?-/, "");
  n = ALIAS[n] || n;
  const collection = (BRANDS.has(n) ? faBrands : faSolid) as IconifyJSON;
  const data = getIconData(collection, n);
  if (!data) return null;
  const r = iconToSVG(data);
  return { body: r.body, viewBox: r.attributes.viewBox };
});
</script>

<template>
  <img v-if="isPath" :src="name" class="lr-icon-img" alt="" />
  <svg
    v-else-if="svg"
    class="lr-icon"
    :viewBox="svg.viewBox"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
    v-html="svg.body"
  />
</template>
