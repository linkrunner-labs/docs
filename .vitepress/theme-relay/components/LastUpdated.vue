<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

// "8th September 2026", in IST so the date matches the team's working day.
const { page } = useData();

function ordinal(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return n + ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th");
}

const label = computed(() => {
  const ts = page.value.lastUpdated;
  if (!ts) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(new Date(ts));
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  return `${ordinal(Number(get("day")))} ${get("month")} ${get("year")}`;
});
</script>

<template>
  <p v-if="label" class="lr-last-updated">Last updated {{ label }}</p>
</template>
