<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import MenuButton from "./components/MenuButton.vue";
import SidebarTabs from "./components/SidebarTabs.vue";
import NavTabs from "./components/NavTabs.vue";
import SidebarFooter from "./components/SidebarFooter.vue";
import Breadcrumbs from "./components/Breadcrumbs.vue";
import CopyPage from "./components/CopyPage.vue";
import AskAboutPage from "./components/AskAboutPage.vue";
import LastUpdated from "./components/LastUpdated.vue";
import MoreLinks from "./components/MoreLinks.vue";
import MediaViewer from "./components/MediaViewer.vue";
import SearchA11y from "./components/SearchA11y.vue";
import TableScroll from "./components/TableScroll.vue";
import AskAiButton from "./components/AskAiButton.vue";
import { landOnHash } from "./legacy-hash";

const { Layout } = DefaultTheme;

// Group headings toggle their group. VitePress renders the heading as a button
// with a second focusable button (the caret) inside it, which screen readers
// and axe flag as nested controls. Keep the heading as the one button, report
// its state, and make the caret decoration only. Headings that can't toggle
// lose their dead Tab stop.
function groupHeadings() {
  for (const item of document.querySelectorAll<HTMLElement>(".VPSidebar .VPSidebarItem:not(.is-link)")) {
    const heading = item.querySelector<HTMLElement>(":scope > .item");
    if (!heading) continue;
    if (!item.classList.contains("collapsible")) {
      heading.removeAttribute("tabindex");
      heading.removeAttribute("role");
      continue;
    }
    heading.setAttribute("aria-expanded", String(!item.classList.contains("collapsed")));
    const caret = heading.querySelector<HTMLElement>(".caret");
    if (caret) {
      caret.removeAttribute("role");
      caret.removeAttribute("tabindex");
      caret.removeAttribute("aria-label");
      caret.setAttribute("aria-hidden", "true");
    }
  }
}

// VitePress only toggles on Enter; buttons also toggle on Space.
function onSidebarKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement;
  if (e.key === " " && t.matches(".VPSidebarItem.collapsible > .item[role=button]")) {
    e.preventDefault();
    t.click();
  }
}

let observer: MutationObserver | undefined;
function watchGroups() {
  const nav = document.querySelector("#VPSidebarNav");
  if (!nav || observer) return;
  // Keep aria-expanded in step when a group opens or closes.
  observer = new MutationObserver(groupHeadings);
  observer.observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });
  nav.addEventListener("keydown", onSidebarKey as EventListener);
}
// Scroll the sidebar (not the page) so the current page's link is in view,
// about a third of the way down. Links already on screen stay put, so clicking
// one doesn't make the sidebar jump. Also runs when the phone drawer (the same
// element) opens.
function revealActiveLink() {
  const sidebar = document.querySelector<HTMLElement>(".VPSidebar");
  const item = sidebar?.querySelector<HTMLElement>(".VPSidebarItem.is-active > .item");
  if (!sidebar || !item) return;
  const top = item.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
  const inView = top >= 80 && top + item.offsetHeight <= sidebar.clientHeight - 24;
  if (!inView) sidebar.scrollTop += top - sidebar.clientHeight / 3;
}

function afterRender() {
  groupHeadings();
  watchGroups();
  revealActiveLink();
  landOnHash(route.path);
}

const route = useRoute();
onMounted(() => {
  setTimeout(afterRender);
  window.addEventListener("hashchange", () => landOnHash(route.path));
});
watch(() => route.path, () => nextTick(() => setTimeout(afterRender)));
</script>

<template>
  <Layout>
    <template #nav-bar-content-before><MenuButton @open="nextTick(revealActiveLink)" /><NavTabs /></template>
    <template #sidebar-nav-before><SidebarTabs /></template>
    <template #sidebar-nav-after><SidebarFooter /></template>
    <template #doc-before><div class="lr-doc-top"><Breadcrumbs /><div class="lr-doc-actions"><AskAboutPage /><CopyPage /></div></div></template>
    <template #doc-footer-before><LastUpdated /></template>
    <template #aside-outline-after><MoreLinks /></template>
    <template #layout-bottom><MediaViewer /><SearchA11y /><TableScroll /><AskAiButton /></template>
  </Layout>
</template>
