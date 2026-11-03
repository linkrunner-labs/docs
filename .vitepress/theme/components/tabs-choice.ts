import { ref } from "vue";

// Tab titles the reader picked (e.g. "Flutter"), most recent first, shared by
// every <Tabs> group and kept across pages. A group shows the most recent
// choice it offers, so picking "Web" or "GoDaddy" in one group doesn't reset
// groups that were following "Flutter". Read after mount so SSR markup matches.
const KEY = "lr-tab-choices";
const MAX = 8;
export const chosenTabs = ref<string[]>([]);

export function chooseTab(title: string) {
  chosenTabs.value = [title, ...chosenTabs.value.filter((t) => t !== title)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(chosenTabs.value));
  } catch {
    // Storage blocked (private mode): the choice lasts for this page only.
  }
}

export function restoreChosenTabs() {
  if (chosenTabs.value.length) return;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (Array.isArray(saved)) chosenTabs.value = saved.filter((t) => typeof t === "string").slice(0, MAX);
  } catch {
    // Storage blocked or bad JSON: use the page's default tab.
  }
}
