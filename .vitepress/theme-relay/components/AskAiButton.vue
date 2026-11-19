<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";
import PhIcon from "./PhIcon.vue";
import { ASK_AI_ENABLED } from "../ask-ai/config";
import { askLoaded, askOpen, captureSelection, closeAsk, openAsk } from "../ask-ai/state";

// "Ask AI" in the top bar, right after search. VitePress renders search
// inside its own component with no slot after it, so the button is moved
// into that box once the page is live; keyboard order then matches what you
// see. The panel (markdown renderer, chat client) is a separate
// chunk that loads on first open.
const AskAiPanel = defineAsyncComponent(() => import("./AskAiPanel.vue"));

const mounted = ref(false);
const button = ref<HTMLButtonElement>();
const fab = ref<HTMLButtonElement>();

function toggle(from?: HTMLElement) {
  if (askOpen.value) closeAsk();
  else openAsk(from ?? button.value);
}

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "i") {
    // Leave Cmd/Ctrl+I alone in rich-text editors.
    if ((e.target as HTMLElement | null)?.isContentEditable) return;
    e.preventDefault();
    if (askOpen.value) closeAsk();
    else openAsk(button.value?.offsetParent ? button.value : (document.activeElement as HTMLElement));
  }
}

onMounted(() => {
  if (!ASK_AI_ENABLED) return;
  mounted.value = !!document.querySelector(".VPNavBarSearch");
  window.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <Teleport v-if="mounted" to=".VPNavBarSearch">
    <button
      ref="button"
      type="button"
      class="lr-ask-trigger"
      aria-label="Ask AI"
      aria-haspopup="dialog"
      :aria-expanded="askOpen"
      aria-keyshortcuts="Control+I Meta+I"
      title="Ask AI (Ctrl+I / ⌘I)"
      @pointerdown="captureSelection"
      @click="toggle(button)"
    >
      <PhIcon name="sparkle" />
      <span class="lr-ask-trigger__label">Ask AI</span>
    </button>
  </Teleport>
  <!-- Launcher at the bottom right: opens the box above it, and closes it. -->
  <button
    v-if="mounted"
    ref="fab"
    type="button"
    class="lr-ask-fab"
    :class="{ 'is-open': askOpen }"
    :aria-label="askOpen ? 'Close Ask AI' : 'Ask AI'"
    aria-haspopup="dialog"
    :aria-expanded="askOpen"
    :title="askOpen ? 'Close' : 'Ask AI (Ctrl+I / ⌘I)'"
    @pointerdown="captureSelection"
    @click="toggle(fab)"
  >
    <PhIcon :name="askOpen ? 'x' : 'sparkle'" />
    <span v-if="!askOpen" class="lr-ask-fab__label">Ask AI</span>
  </button>
  <AskAiPanel v-if="ASK_AI_ENABLED && askLoaded" />
</template>
