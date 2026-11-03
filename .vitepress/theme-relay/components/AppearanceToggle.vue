<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import PhIcon from "./PhIcon.vue";

// The drawer's appearance switch (below 960px; the top bar has its own).
// The server render can't know the reader's stored appearance, and Vue doesn't
// patch attributes while hydrating. So both icons render and CSS shows the
// right one (.dark), and the pressed state is set once mounted.
const { isDark } = useData();
const pressed = ref(false);
onMounted(() => (pressed.value = isDark.value));
watch(isDark, (d) => (pressed.value = d));
</script>

<template>
  <button type="button" class="lr-appearance" :aria-pressed="pressed" @click="isDark = !isDark">
    <PhIcon name="sun" class="lr-appearance__light" />
    <PhIcon name="moon" class="lr-appearance__dark" />
    Dark mode
  </button>
</template>
