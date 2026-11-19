import { ref } from "vue";
import { headingBefore } from "./page-context";

// Shared between the small top-bar button and the lazily loaded panel.
export const askOpen = ref(false);
/**
 * Docked as a sidebar on the right (wide screens only) instead of floating.
 * A layout preference, kept in localStorage; no conversation data.
 */
const DOCK_KEY = "lr-ask-docked";
export const askDocked = ref(false);
export function loadDockPref() {
  try {
    askDocked.value = localStorage.getItem(DOCK_KEY) === "1";
  } catch {
    /* storage blocked: stay floating */
  }
}
export function setDocked(on: boolean) {
  askDocked.value = on;
  try {
    if (on) localStorage.setItem(DOCK_KEY, "1");
    else localStorage.removeItem(DOCK_KEY);
  } catch {
    /* storage blocked: still applies for this page view */
  }
}
/** The sidebar only fits next to the article from this width up. */
export const DOCK_MIN_WIDTH = 1180;

/** Set once the panel has been opened, so its code only loads on demand. */
export const askLoaded = ref(false);
/** The control that opened the panel; focus goes back to it on close. */
let returnTo: HTMLElement | null = null;

/** Text the reader highlighted in the article, sent once with the next question. */
export const askSelection = ref("");
/** The heading the selection sits under; sent as the section instead of the scroll position. */
export const askSelectionSection = ref("");
export const MAX_SELECTION_CHARS = 500;

/** The reader's current selection, if it sits inside the article (.vp-doc). */
export function readDocSelection(): { text: string; section: string } | null {
  const sel = typeof window !== "undefined" ? window.getSelection() : null;
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const inDoc = (n: Node | null) => !!(n && (n instanceof Element ? n : n.parentElement)?.closest(".vp-doc"));
  if (!inDoc(sel.anchorNode) || !inDoc(sel.focusNode)) return null;
  const text = sel.toString().replace(/\s+/g, " ").trim().slice(0, MAX_SELECTION_CHARS);
  if (!text) return null;
  // Start of the range in document order, whichever way it was dragged.
  return { text, section: headingBefore(sel.getRangeAt(0).startContainer) };
}

/** Store a selection (or clear it with null). */
export function setSelection(s: { text: string; section: string } | null) {
  askSelection.value = s?.text ?? "";
  askSelectionSection.value = s?.section ?? "";
}

/** Read the selection before focus moves into the box (focusing clears it). */
export function captureSelection() {
  const s = readDocSelection();
  if (s) setSelection(s);
}

/**
 * "page" when opened from the "Ask AI about this page" button: the panel keeps
 * the page context on and offers page-specific starter questions.
 */
export const askMode = ref<"general" | "page">("general");
/** Bumped on every page-mode open, so the panel can bring the page chip back even when already open. */
export const askPageRequest = ref(0);

export function openAsk(from?: HTMLElement | null, mode: "general" | "page" = "general") {
  askMode.value = mode;
  if (mode === "page") askPageRequest.value++;
  captureSelection();
  returnTo = from ?? (document.activeElement as HTMLElement | null);
  askLoaded.value = true;
  askOpen.value = true;
}

export function closeAsk(restoreFocus = true) {
  if (!askOpen.value) return;
  askOpen.value = false;
  const target = returnTo;
  returnTo = null;
  if (restoreFocus && target?.isConnected) setTimeout(() => target.focus({ preventScroll: true }));
}
