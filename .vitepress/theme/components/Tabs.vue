<script setup lang="ts">
import { ref, computed, useSlots, useId, cloneVNode, Fragment, provide, onMounted, onBeforeUnmount, nextTick, type VNode } from "vue";
import { chosenTabs, chooseTab, restoreChosenTabs } from "./tabs-choice";

const props = defineProps<{ label?: string }>();
const slots = useSlots();
const uid = useId();
const local = ref(0);
const buttons = ref<HTMLButtonElement[]>([]);

// Flatten slot vnodes (handles v-for / fragments) and keep only <Tab> children
// (identified by their `title` prop). Works during SSR — no registration.
function collect(nodes: unknown[], out: VNode[] = []): VNode[] {
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const n = node as VNode;
    if (n.type === Fragment && Array.isArray(n.children)) collect(n.children, out);
    else if (n.props && n.props.title != null) out.push(n);
  }
  return out;
}

const tabs = computed(() => collect(slots.default ? slots.default() : []));
const titles = computed(() => tabs.value.map((n) => String(n.props!.title)));
// Mintlify's tab ids (legacy-anchors.ts), so /page#tab-id links still pick
// the tab. They sit on empty markers, not the buttons: Mintlify reused names
// like "ios" for a heading too, and the buttons keep their own ids for ARIA.
const anchors = computed(() => tabs.value.map((n) => (n.props!.anchor as string | undefined) || undefined));

// Groups follow the reader's most recent choice they offer (e.g. "Flutter"),
// so every step on the page shows the same platform.
const active = computed(() => {
  for (const t of chosenTabs.value) {
    const i = titles.value.indexOf(t);
    if (i >= 0) return i;
  }
  return local.value;
});
provide("lrTabsActive", active);

const tabId = (i: number) => `${uid}-tab-${i}`;
const panelId = (i: number) => `${uid}-panel-${i}`;
const panels = computed(() =>
  tabs.value.map((n, i) => cloneVNode(n, { lrIndex: i, id: panelId(i), "aria-labelledby": tabId(i) })),
);
const Panels = () => panels.value;

function select(i: number) {
  local.value = i;
  chooseTab(titles.value[i]);
}

// Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern).
function onKey(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  const n = tabs.value.length;
  const moves: Record<string, number> = {
    ArrowRight: (active.value + 1) % n,
    ArrowLeft: (active.value - 1 + n) % n,
    Home: 0,
    End: n - 1,
  };
  if (!(e.key in moves)) return;
  e.preventDefault();
  select(moves[e.key]);
  nextTick(() => buttons.value[active.value]?.focus());
}

// Name the tab list for screen readers: "Code examples" when the panels hold
// code samples, otherwise a neutral "Options" (e.g. DNS provider tabs).
const root = ref<HTMLElement>();
const label = ref(props.label || "Code examples");

// A link to a tab (/page#android-2) selects it and scrolls it into view, when
// the link resolves to this group's marker (the first element with that id,
// as on Mintlify).
function selectFromHash() {
  const raw = location.hash.slice(1);
  if (!raw) return;
  const el = document.getElementById(safeDecode(raw)) ?? document.getElementById(raw);
  if (!el || el.parentElement !== root.value || !el.classList.contains("lr-tabs__anchor")) return;
  const i = Number(el.dataset.tab);
  if (!(i >= 0 && i < tabs.value.length)) return;
  select(i);
  nextTick(() => buttons.value[i]?.scrollIntoView({ block: "center" }));
}
function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
onBeforeUnmount(() => window.removeEventListener("hashchange", selectFromHash));
onMounted(() => {
  restoreChosenTabs();
  selectFromHash();
  window.addEventListener("hashchange", selectFromHash);
  const panels = root.value ? [...root.value.querySelectorAll(":scope > .lr-tabs__panels > *")] : [];
  if (!props.label && panels.length && !panels.some((p) => p.querySelector('div[class*="language-"]'))) label.value = "Options";
});
</script>

<template>
  <div ref="root" class="lr-tabs">
    <template v-for="(a, i) in anchors" :key="'a' + i">
      <span v-if="a" :id="a" class="lr-tabs__anchor" :data-tab="i" aria-hidden="true"></span>
    </template>
    <div class="lr-tabs__bar" role="tablist" :aria-label="label" @keydown="onKey">
      <button
        v-for="(t, i) in titles"
        :id="tabId(i)"
        :key="i"
        ref="buttons"
        type="button"
        role="tab"
        :aria-selected="active === i"
        :aria-controls="panelId(i)"
        :tabindex="active === i ? 0 : -1"
        :class="['lr-tabs__btn', { 'is-active': active === i }]"
        @click="select(i)"
      >
        {{ t }}
      </button>
    </div>
    <div class="lr-tabs__panels"><Panels /></div>
  </div>
</template>
