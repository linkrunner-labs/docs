<script setup lang="ts">
import { inject, computed, type Ref } from "vue";

// `anchor` is read by <Tabs> (the tab button's id); declared so it isn't
// rendered as an attribute on the panel.
const props = defineProps<{ title?: string; lrIndex?: number; anchor?: string }>();
const active = inject<Ref<number> | null>("lrTabsActive", null);

// Visible when this tab is active, or when used outside a <Tabs> wrapper.
// id / aria-labelledby fall through from <Tabs>.
const show = computed(() => !active || active.value === props.lrIndex);
</script>

<template>
  <div v-show="show" class="lr-tabs__panel" :role="active ? 'tabpanel' : undefined" :tabindex="active ? 0 : undefined">
    <slot />
  </div>
</template>
