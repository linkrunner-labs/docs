<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRoute } from "vitepress";

// Tables scroll sideways when they are wider than the column. Fade whichever
// edge has more columns behind it, so readers on phones can tell there is
// more to see (relay.css draws the fade from these classes).
const route = useRoute();
let resize: ResizeObserver | undefined;

function update(t: HTMLElement) {
  const max = t.scrollWidth - t.clientWidth;
  t.classList.toggle("lr-more-left", max > 2 && t.scrollLeft > 2);
  t.classList.toggle("lr-more-right", max > 2 && t.scrollLeft < max - 2);
}

function onScroll(e: Event) {
  update(e.target as HTMLElement);
}

function decorate() {
  resize?.disconnect();
  resize = new ResizeObserver((entries) => entries.forEach((e) => update(e.target as HTMLElement)));
  for (const t of document.querySelectorAll<HTMLElement>(".vp-doc table")) {
    if (!t.dataset.lrScroll) {
      t.dataset.lrScroll = "1";
      t.addEventListener("scroll", onScroll, { passive: true });
    }
    resize.observe(t);
    update(t);
  }
}

onMounted(decorate);
watch(() => route.path, () => nextTick(() => setTimeout(decorate)));
onBeforeUnmount(() => resize?.disconnect());
</script>

<template>
  <span hidden />
</template>
