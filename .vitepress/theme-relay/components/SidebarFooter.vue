<script setup lang="ts">
import AppearanceToggle from "./AppearanceToggle.vue";
import { MAIN_SITE } from "../../site";
</script>

<template>
  <div class="lr-sidebar-bottom">
    <AppearanceToggle />
    <!-- Preview only: points readers back to the current docs. -->
    <div v-if="!MAIN_SITE" class="lr-sidebar-footer">
      <span class="lr-square" aria-hidden="true"></span>
      <span>Docs v2 preview</span>
      <a href="https://docs.linkrunner.io" target="_blank" rel="noreferrer">Current docs</a>
    </div>
  </div>
</template>
