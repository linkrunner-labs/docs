<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vitepress";
import { useSidebar } from "vitepress/theme";
import PhIcon from "./PhIcon.vue";

// VitePress keeps the sidebar's open state inside its Layout, and only its
// local-nav "Menu" button can open it. This button sits at the left of the top
// bar (as in the Relay docs design) and forwards to that button, which the
// theme CSS hides. Pressing it again, Escape, or a backdrop click closes it.
const expanded = ref(false);
const { hasSidebar } = useSidebar();
let observer: MutationObserver | undefined;

function target(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(".VPLocalNav button.menu");
}

function bind() {
  observer?.disconnect();
  const btn = target();
  if (!btn) return;
  expanded.value = btn.getAttribute("aria-expanded") === "true";
  observer = new MutationObserver(() => {
    expanded.value = btn.getAttribute("aria-expanded") === "true";
  });
  observer.observe(btn, { attributes: true, attributeFilter: ["aria-expanded"] });
}

// While the drawer is open, everything except the drawer and this button is
// inert, so Tab cannot reach the page behind the backdrop.
const BEHIND = [
  ".VPSkipLink",
  ".VPNavBar .title",
  ".VPNavBar .content-body > :not(.lr-menu-button)",
  ".VPLocalNav",
  ".VPContent",
  ".VPFooter",
];
const self = ref<HTMLButtonElement>();
const route = useRoute();
let closedByRoute = false;

const emit = defineEmits<{ open: [] }>();

// The drawer only exists below 960px. If the window grows while it is open,
// VitePress keeps it "open" but hides it, so the page must not stay inert.
let drawerQuery: MediaQueryList | undefined;
const onQuery = () => setInert(expanded.value);

function setInert(on: boolean) {
  const active = on && !!drawerQuery?.matches;
  for (const el of document.querySelectorAll<HTMLElement>(BEHIND.join(","))) el.inert = active;
}

watch(expanded, (open, wasOpen) => {
  setInert(open);
  if (open) emit("open");
  // Escape, backdrop and this button all land focus back on the button.
  // Following a link leaves focus where VitePress puts it on the new page.
  if (!open && wasOpen && !closedByRoute) {
    setTimeout(() => {
      const a = document.activeElement;
      if (!a || a === document.body || a.closest(".VPSidebar")) self.value?.focus();
    });
  }
  closedByRoute = false;
});

// VitePress renders its local nav after hydration, so bind on the next tick.
onMounted(() => {
  drawerQuery = window.matchMedia("(max-width: 959px)");
  drawerQuery.addEventListener("change", onQuery);
  setTimeout(bind);
});
watch(
  () => route.path,
  () => {
    closedByRoute = expanded.value;
    setTimeout(bind);
  },
);
onBeforeUnmount(() => {
  observer?.disconnect();
  drawerQuery?.removeEventListener("change", onQuery);
  setInert(false);
});

function toggle() {
  bind();
  if (expanded.value) {
    // VitePress closes the sidebar (and restores focus) on Escape keyup.
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
  } else {
    target()?.click();
  }
}
</script>

<template>
  <button
    v-show="hasSidebar"
    ref="self"
    type="button"
    class="lr-menu-button"
    :aria-label="expanded ? 'Close navigation menu' : 'Open navigation menu'"
    aria-controls="VPSidebarNav"
    :aria-expanded="expanded"
    @click="toggle"
  >
    <PhIcon :name="expanded ? 'x' : 'list'" />
  </button>
</template>
