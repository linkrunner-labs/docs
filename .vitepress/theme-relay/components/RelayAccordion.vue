<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import Icon from "./RelayIcon.vue";

// Relay build's Accordion (FAQ and troubleshooting entries). Same props as
// theme/components/Accordion.vue, plus the Mintlify `description` line, which
// the classic component drops. Each entry gets an id from its title, so
// /page#q-<slug> links straight to it and opens it. `anchor` is the id
// docs.linkrunner.io (Mintlify) used (legacy-anchors.ts); it works the same.
const props = defineProps<{
  title?: string;
  description?: string;
  icon?: string;
  defaultOpen?: boolean | string;
  anchor?: string;
}>();

const startOpen = props.defaultOpen === true || props.defaultOpen === "" || props.defaultOpen === "true";

const id = computed(
  () =>
    "q-" +
    (props.title ?? "")
      .toLowerCase()
      .replace(/['’"“”]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80)
);

const el = ref<HTMLDetailsElement>();

function openFromHash() {
  let hash = location.hash.slice(1);
  try {
    hash = decodeURIComponent(hash);
  } catch {
    // Malformed escape: match the raw hash.
  }
  if (!el.value || (hash !== id.value && (!props.anchor || hash !== props.anchor))) return;
  el.value.open = true;
  el.value.scrollIntoView({ block: "start" });
}

onMounted(() => {
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
});
onBeforeUnmount(() => window.removeEventListener("hashchange", openFromHash));
</script>

<template>
  <details :id="id" ref="el" class="lr-accordion" :open="startOpen">
    <summary class="lr-accordion__summary">
      <span v-if="anchor && anchor !== id" :id="anchor" class="lr-accordion__anchor" aria-hidden="true"></span>
      <Icon v-if="icon" :name="icon" class="lr-accordion__icon" />
      <span class="lr-accordion__text">
        <span class="lr-accordion__title">{{ title }}</span>
        <span v-if="description" class="lr-accordion__description">{{ description }}</span>
      </span>
      <Icon name="chevron-right" class="lr-accordion__chevron" />
    </summary>
    <div class="lr-accordion__body"><slot /></div>
  </details>
</template>
