<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import PhIcon from "./PhIcon.vue";

type Link = { text: string; link: string };
type Overview = {
  eyebrow: string;
  title: string;
  lead: string;
  actions?: (Link & { primary?: boolean })[];
  flow: { label: string; steps: (Link & { detail: string })[]; footer: Link };
};

// Content comes from the page's `overview` frontmatter so copy edits stay in
// relay-pages/index.md.
const { frontmatter } = useData();
const o = computed(() => frontmatter.value.overview as Overview);
const total = computed(() => String(o.value.flow.steps.length).padStart(2, "0"));
</script>

<template>
  <section class="lr-hero" aria-labelledby="lr-hero-title">
    <div class="lr-hero__copy">
      <p class="lr-eyebrow"><span class="lr-square" aria-hidden="true"></span>{{ o.eyebrow }}</p>
      <h1 id="lr-hero-title" class="lr-hero__title">{{ o.title }}</h1>
      <p class="lr-hero__lead">{{ o.lead }}</p>
      <div v-if="o.actions?.length" class="lr-hero__actions">
        <a
          v-for="a in o.actions"
          :key="a.link"
          :href="withBase(a.link)"
          :class="['lr-button', a.primary ? 'lr-button--primary' : 'lr-button--outlined']"
        >
          {{ a.text }} <PhIcon name="arrow-right" />
        </a>
      </div>
    </div>

    <div class="lr-flow">
      <p class="lr-flow__head">
        <span>{{ o.flow.label }}</span>
        <span class="lr-flow__count" aria-hidden="true">01 → {{ total }}</span>
      </p>
      <ol class="lr-flow__steps">
        <li v-for="(s, i) in o.flow.steps" :key="s.link" :class="{ 'is-first': i === 0 }">
          <a :href="withBase(s.link)">
            <span class="lr-flow__dot" aria-hidden="true"></span>
            <span class="lr-flow__title">{{ s.text }}</span>
            <span class="lr-flow__detail">{{ s.detail }}</span>
          </a>
        </li>
      </ol>
      <a class="lr-flow__footer" :href="withBase(o.flow.footer.link)">
        {{ o.flow.footer.text }} <PhIcon name="arrow-right" />
      </a>
    </div>
  </section>
</template>
