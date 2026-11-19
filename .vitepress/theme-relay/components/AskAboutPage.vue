<script setup lang="ts">
import { ref } from "vue";
import PhIcon from "./PhIcon.vue";
import { ASK_AI_ENABLED } from "../ask-ai/config";
import { askOpen, captureSelection, openAsk } from "../ask-ai/state";

// A quiet "Ask AI" next to "Copy page" on every doc page. It opens the Ask AI
// box in page mode: the page context stays on and the starter questions are
// about this page. Text highlighted in the article is read on pointer-down,
// before the click moves focus and clears the selection.
const button = ref<HTMLButtonElement>();

function open() {
  const wasOpen = askOpen.value;
  openAsk(button.value, "page");
  // Already open: move focus to the question box, but not on touch screens,
  // where that would pop up the keyboard (the panel's own open does the same).
  if (wasOpen && window.matchMedia("(pointer: fine)").matches)
    setTimeout(() => document.querySelector<HTMLTextAreaElement>("#lr-ask-q")?.focus());
}
</script>

<template>
  <button
    v-if="ASK_AI_ENABLED"
    ref="button"
    type="button"
    class="lr-ask-page"
    title="Ask AI about this page"
    aria-label="Ask AI about this page"
    aria-haspopup="dialog"
    :aria-expanded="askOpen"
    @pointerdown="captureSelection"
    @click="open"
  >
    <PhIcon name="sparkle" />
    <span>Ask AI<span class="lr-ask-page__long"> about this page</span></span>
  </button>
</template>
