<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useData } from "vitepress";
import PhIcon from "./PhIcon.vue";
import { pagePath } from "../page-path";

// Copies this page as Markdown (built by agent-markdown.ts) so readers can
// paste it into an AI coding agent.
const { page } = useData();
const path = computed(() => pagePath(page.value.relativePath));
const mdUrl = computed(() => (path.value === "/" ? "/index.md" : `${path.value}.md`));

type State = "idle" | "copied" | "failed";
const state = ref<State>("idle");
let text: Promise<string> | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

watch(path, () => {
  text = null;
  state.value = "idle";
});

// Fetched on hover or focus, so the click can copy straight away.
function load(): Promise<string> {
  text ??= fetch(mdUrl.value).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
    return r.text();
  });
  text.catch(() => (text = null));
  return text;
}

async function write(value: string) {
  if (window.isSecureContext && navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  // Plain-http previews have no async clipboard.
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.append(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  if (!ok) throw new Error("copy failed");
}

async function copy() {
  clearTimeout(timer);
  try {
    await write(await load());
    state.value = "copied";
  } catch {
    state.value = "failed";
  }
  timer = setTimeout(() => (state.value = "idle"), 2000);
}

const label = computed(() =>
  state.value === "copied" ? "Copied" : state.value === "failed" ? "Couldn't copy" : "Copy page"
);
</script>

<template>
  <button
    type="button"
    class="lr-copy-page"
    :class="`is-${state}`"
    title="Copy this page as Markdown to paste into an AI coding agent"
    @pointerenter="load"
    @focus="load"
    @click="copy"
  >
    <PhIcon :name="state === 'copied' ? 'check' : 'copy'" />
    <span aria-live="polite">{{ label }}</span>
  </button>
</template>
