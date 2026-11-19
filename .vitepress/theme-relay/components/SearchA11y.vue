<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vitepress";

// VitePress's search box is exposed as a "button" and drops focus on <body>
// when it closes. While it is open, present it as a named modal dialog with a
// combobox input and an inert page behind it. When it closes, return focus to
// whatever opened it (unless a result was chosen and the page changed).
const route = useRoute();
let lastFocus: HTMLElement | null = null;
let openedOn = "";
let box: HTMLElement | null = null;
let bodyObserver: MutationObserver | undefined;
let boxObserver: MutationObserver | undefined;

function onFocusIn(e: FocusEvent) {
  const t = e.target as HTMLElement;
  if (!t.closest?.(".VPLocalSearchBox")) lastFocus = t;
}

// Clicking plain text moves focus to <body>; forget the old element then, so
// closing search never jumps back to something focused long ago.
function onFocusOut(e: FocusEvent) {
  if (!e.relatedTarget) lastFocus = null;
}

function syncExpanded() {
  box?.removeAttribute("aria-owns");
  const input = box?.querySelector<HTMLInputElement>("#localsearch-input");
  input?.setAttribute("aria-expanded", String(!!box?.querySelector("#localsearch-list[role=listbox]")));
}

function opened(el: HTMLElement) {
  box = el;
  openedOn = route.path;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", "Search documentation");
  el.removeAttribute("aria-labelledby");
  el.removeAttribute("aria-expanded");
  el.removeAttribute("aria-haspopup");
  el.removeAttribute("aria-owns");
  el.querySelector("#localsearch-input")?.setAttribute("role", "combobox");
  syncExpanded();
  boxObserver = new MutationObserver(syncExpanded);
  boxObserver.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-owns"] });
  const app = document.getElementById("app");
  if (app) app.inert = true;
}

function closed() {
  boxObserver?.disconnect();
  box = null;
  const app = document.getElementById("app");
  if (app) app.inert = false;
  if (route.path !== openedOn) return;
  const target = lastFocus?.isConnected ? lastFocus : document.querySelector<HTMLElement>(".DocSearch-Button");
  setTimeout(() => target?.focus({ preventScroll: true }));
}

onMounted(() => {
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  bodyObserver = new MutationObserver(() => {
    const el = document.querySelector<HTMLElement>("body > .VPLocalSearchBox");
    if (el && el !== box) opened(el);
    else if (!el && box) closed();
  });
  bodyObserver.observe(document.body, { childList: true });
});

onBeforeUnmount(() => {
  document.removeEventListener("focusin", onFocusIn);
  document.removeEventListener("focusout", onFocusOut);
  bodyObserver?.disconnect();
  boxObserver?.disconnect();
});
</script>

<template>
  <span hidden />
</template>
