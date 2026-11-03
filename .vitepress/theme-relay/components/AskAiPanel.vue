<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useData, useRoute, useRouter } from "vitepress";
import PhIcon from "./PhIcon.vue";
import { askDocked, askMode, askOpen, askPageRequest, DOCK_MIN_WIDTH, loadDockPref, setDocked, askSelection, askSelectionSection, closeAsk, readDocSelection, setSelection } from "../ask-ai/state";
import { ask, AskError, sendFeedback, type ChatMessage, type PageContext, type Source } from "../ask-ai/client";
import { clip, currentSection } from "../ask-ai/page-context";
import { internalPath, renderMarkdown } from "../ask-ai/markdown";
import { copyText } from "../ask-ai/copy";
import { MAX_MESSAGES, MAX_QUESTION_CHARS } from "../ask-ai/config";

// The Ask AI drawer. Loaded on first open (defineAsyncComponent in
// AskAiButton.vue). Structure follows shadcn's AI Elements chat: a
// conversation that sticks to the bottom while it streams, message bubbles,
// a markdown response, sources, suggestion chips and a prompt input with
// send/stop. Colours and type come from the Relay tokens in relay.css.

type Status = "pending" | "streaming" | "done" | "stopped" | "error";
type TurnError = { kind: AskError["kind"]; retryAfterSeconds?: number };
type Turn = {
  id: number;
  question: string;
  answer: string;
  sources: Source[];
  status: Status;
  answered?: boolean;
  /** From the done event; needed to rate the answer. */
  questionId?: string;
  rating?: 1 | -1;
  error?: TurnError;
  copied?: boolean;
  /** Page context sent with the question, reused on retry. */
  page?: PageContext;
  /** The sources list is folded into one line until opened. */
  sourcesOpen?: boolean;
};

const SUGGESTIONS = [
  "How do I set up deep links in Flutter?",
  "Why don't my Meta installs match Linkrunner?",
  "How do I send revenue events?",
  "How do I test attribution on a real device?",
];
// Opened from "Ask AI about this page": questions about the page in view.
const PAGE_SUGGESTIONS = [
  "Summarise this page in a few bullets",
  "What do I need before I start?",
  "Walk me through the steps",
  "What usually goes wrong here?",
];
const suggestions = computed(() => (pageMode.value ? PAGE_SUGGESTIONS : SUGGESTIONS));

// The conversation lives in memory, and in sessionStorage so it survives a
// reload in the same tab. Never localStorage.
const STORE_KEY = "lr-ask-ai";
const turns = reactive<Turn[]>(restore());
let nextId = turns.reduce((m, t) => Math.max(m, t.id), 0) + 1;

function restore(): Turn[] {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    const saved = raw ? (JSON.parse(raw) as Turn[]) : [];
    return saved
      .filter((t) => t && typeof t.question === "string" && typeof t.answer === "string")
      .map((t) => ({
        ...t,
        sources: Array.isArray(t.sources) ? t.sources : [],
        status: t.status === "pending" || t.status === "streaming" ? "stopped" : t.status,
      }));
  } catch {
    return [];
  }
}

function persist() {
  try {
    if (!turns.length) sessionStorage.removeItem(STORE_KEY);
    else sessionStorage.setItem(STORE_KEY, JSON.stringify(turns.slice(-MAX_MESSAGES)));
  } catch {
    // Storage blocked (private mode): history stays in memory.
  }
}

const route = useRoute();
const router = useRouter();
const { page: pageData } = useData();

// Page awareness (contract section C). The page chip shows the page title and
// the heading the reader is scrolled to; the reader can drop it until the
// route changes. The selection chip holds text highlighted in the article and
// is sent once.
const scrollSection = ref("");
// With a highlight, the section is the heading the highlight sits under;
// otherwise the heading the reader is scrolled to.
const section = computed(() => (askSelection.value ? askSelectionSection.value : scrollSection.value));
const pageDropped = ref(false);
const pageTitle = computed(() => clip(pageData.value.title));
const showPageChip = computed(() => !pageDropped.value && !!pageTitle.value);

function pageContext(): PageContext | undefined {
  const selection = askSelection.value ? askSelection.value.slice(0, 500) : "";
  if (pageDropped.value && !selection) return undefined;
  const ctx: PageContext = { path: route.path.slice(0, 200) };
  if (!pageDropped.value) {
    if (pageTitle.value) ctx.title = pageTitle.value;
    const sec = askSelection.value ? askSelectionSection.value : currentSection();
    if (sec) ctx.section = sec;
  }
  if (selection) ctx.selection = selection;
  return ctx;
}

let sectionFrame = 0;
function trackSection() {
  if (sectionFrame) return;
  sectionFrame = requestAnimationFrame(() => {
    sectionFrame = 0;
    scrollSection.value = currentSection();
  });
}

// While the box is open, text the reader highlights in the article becomes
// the selection chip. Selections inside the box itself are ignored, and an
// empty selection (e.g. focusing the input) keeps the chip.
let selTimer: ReturnType<typeof setTimeout> | undefined;
function onSelectionChange() {
  clearTimeout(selTimer);
  selTimer = setTimeout(() => {
    const s = readDocSelection();
    if (s) setSelection(s);
  }, 150);
}

const panel = ref<HTMLElement>();
const scroller = ref<HTMLElement>();
const content = ref<HTMLElement>();
const input = ref<HTMLTextAreaElement>();
const draft = ref("");
const announcement = ref("");
const atBottom = ref(true);
let stick = true;
let controller: AbortController | null = null;

const busy = computed(() => turns.some((t) => t.status === "pending" || t.status === "streaming"));
const nearLimit = computed(() => draft.value.length > MAX_QUESTION_CHARS - 150);

// Re-render an answer only when its text changed.
const htmlCache = new Map<number, { src: string; html: string }>();
function html(t: Turn): string {
  const hit = htmlCache.get(t.id);
  if (hit && hit.src === t.answer) return hit.html;
  const out = renderMarkdown(t.answer);
  htmlCache.set(t.id, { src: t.answer, html: out });
  return out;
}

function history(upTo: Turn): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const t of turns) {
    if (t === upTo) break;
    if ((t.status === "done" || t.status === "stopped") && t.answer.trim()) {
      out.push({ role: "user", content: t.question });
      out.push({ role: "assistant", content: t.answer.slice(0, 4000) });
    }
  }
  out.push({ role: "user", content: upTo.question });
  return out.slice(-MAX_MESSAGES);
}

function plainText(markdownHtml: string): string {
  // An inert document: nothing in it runs or loads.
  const doc = new DOMParser().parseFromString(markdownHtml, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

async function run(t: Turn) {
  controller?.abort();
  const ctrl = new AbortController();
  controller = ctrl;
  t.status = "pending";
  t.answer = "";
  t.sources = [];
  t.error = undefined;
  t.answered = undefined;
  t.questionId = undefined;
  t.rating = undefined;
  announcement.value = "";
  stick = true;
  scrollToBottom();
  try {
    await ask(history(t), t.page, ctrl.signal, {
      onSources: (s) => (t.sources = s),
      onDelta: (text) => {
        t.status = "streaming";
        t.answer += text;
      },
      onDone: (answered, questionId) => {
        t.questionId = questionId;
        t.status = "done";
        t.answered = answered;
      },
    });
    if (t.status !== "done") t.status = "done";
    announcement.value = `Answer ready. ${plainText(html(t))}`;
  } catch (e) {
    if (ctrl.signal.aborted) {
      t.status = "stopped";
      announcement.value = "Answer stopped.";
    } else {
      const err = e instanceof AskError ? e : new AskError("network", String(e));
      t.status = "error";
      t.error = { kind: err.kind, retryAfterSeconds: err.retryAfterSeconds };
      announcement.value = errorText(t.error);
    }
  } finally {
    if (controller === ctrl) controller = null;
    persist();
  }
}

function send(text?: string) {
  const q = (text ?? draft.value).trim().slice(0, MAX_QUESTION_CHARS);
  if (!q || busy.value) return;
  turns.push({ id: nextId++, question: q, answer: "", sources: [], status: "pending", page: pageContext() });
  // The selection is one-shot; the page chip stays.
  setSelection(null);
  draft.value = "";
  nextTick(autosize);
  // Work on the reactive proxy held in the array, so the view updates.
  run(turns[turns.length - 1]);
}

function retry(t: Turn) {
  if (busy.value) return;
  run(t);
}

function stop() {
  controller?.abort();
}

function newChat() {
  controller?.abort();
  turns.splice(0);
  htmlCache.clear();
  announcement.value = "Started a new chat.";
  persist();
  nextTick(() => input.value?.focus());
}

// One rating per answer; picking the other one switches it.
function rate(t: Turn, rating: 1 | -1) {
  if (!t.questionId || t.rating === rating) return;
  t.rating = rating;
  announcement.value = "Thanks for the feedback.";
  persist();
  sendFeedback(t.questionId, rating);
}

function minutes(s?: number) {
  if (!s || s <= 0) return "a few minutes";
  const m = Math.max(1, Math.ceil(s / 60));
  return m === 1 ? "1 minute" : `${m} minutes`;
}

function errorText(err: TurnError): string {
  switch (err.kind) {
    case "rate_limited":
      return `You've asked a lot of questions. Try again in ${minutes(err.retryAfterSeconds)}.`;
    case "busy":
      return "Ask AI is resting for today. Use search instead.";
    case "unavailable":
      return "Ask AI isn't available right now. Try again later.";
    case "network":
      return "Couldn't reach Ask AI. Check your connection and try again.";
    case "invalid":
      return "That question couldn't be sent. Try a shorter question.";
    default:
      return "Something went wrong while answering. Try again.";
  }
}
const canRetry = (err: TurnError) => err.kind === "network" || err.kind === "failed";

function openSearch() {
  closeAsk(false);
  setTimeout(() => document.querySelector<HTMLElement>(".DocSearch-Button")?.click());
}

async function copyAnswer(t: Turn) {
  try {
    await copyText(t.answer);
    t.copied = true;
    announcement.value = "Answer copied.";
    setTimeout(() => (t.copied = false), 2000);
  } catch {
    announcement.value = "Couldn't copy the answer.";
  }
}

const isPhone = () => window.matchMedia("(max-width: 767px)").matches;

// Links inside answers and sources: same-site pages open in place with the
// router; everything else is a normal external link (new tab).
function goInternal(e: MouseEvent, href: string) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const path = internalPath(href);
  if (!path) return;
  e.preventDefault();
  router.go(path);
  if (isPhone()) closeAsk(false);
}

function onAnswerClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const copyBtn = target.closest<HTMLButtonElement>("[data-lr-copy-code]");
  if (copyBtn) {
    const code = copyBtn.closest(".lr-ask-code")?.querySelector("code")?.textContent ?? "";
    copyText(code).then(
      () => {
        copyBtn.classList.add("is-copied");
        copyBtn.setAttribute("aria-label", "Copied");
        announcement.value = "Code copied.";
        setTimeout(() => {
          copyBtn.classList.remove("is-copied");
          copyBtn.setAttribute("aria-label", "Copy code");
        }, 2000);
      },
      () => (announcement.value = "Couldn't copy the code.")
    );
    return;
  }
  const a = target.closest<HTMLAnchorElement>("a[data-lr-internal]");
  if (a) goInternal(e, a.getAttribute("href") || "");
}

function sourceLabel(s: Source) {
  try {
    const u = new URL(s.url);
    return u.pathname.replace(/^\/|\/$/g, "") || u.host;
  } catch {
    return s.url;
  }
}
const sourceHref = (s: Source) => internalPath(s.url) ?? (/^https?:/i.test(s.url) ? s.url : undefined);
const sourceExternal = (s: Source) => !internalPath(s.url);

// Prompt input: Enter sends, Shift+Enter adds a line.
function onInputKey(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    send();
  }
}
function autosize() {
  const el = input.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
}

// Conversation scroll: follow the stream while the reader is at the bottom;
// once they scroll up, stay put and offer a jump back down.
function onScroll() {
  const el = scroller.value;
  if (!el) return;
  atBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 32;
  stick = atBottom.value;
}
function scrollToBottom(smooth = false) {
  nextTick(() => {
    const el = scroller.value;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduce ? "smooth" : "auto" });
    stick = true;
    atBottom.value = true;
  });
}
let resize: ResizeObserver | undefined;

function hasSources(t: Turn) {
  return t.sources.length > 0 && t.status !== "pending" && t.answered !== false;
}
function toggleSources(t: Turn) {
  t.sourcesOpen = !t.sourcesOpen;
  persist();
}
function showFooter(t: Turn) {
  return hasSources(t) || ((t.status === "done" || t.status === "stopped") && !!t.answer);
}

// Sidebar mode: only on screens wide enough to keep the article readable next
// to it. Below that the toggle hides and the box floats as before.
const wide = ref(false);
let wideQuery: MediaQueryList | null = null;
function onWide() {
  const was = wide.value;
  wide.value = !!wideQuery?.matches;
  // The dock button disappears below the breakpoint; don't drop focus to <body>.
  if (was && !wide.value && document.activeElement?.closest?.(".lr-ask__actions")) {
    nextTick(() => panel.value?.querySelector<HTMLElement>('.lr-ask__iconbtn[aria-label="Close Ask AI"]')?.focus());
  }
}
const canDock = computed(() => wide.value);
const docked = computed(() => askDocked.value && wide.value);
watch(
  () => askOpen.value && docked.value,
  (on) => document.documentElement.classList.toggle("lr-ask-docked", on)
);

// Dialog behaviour: Escape closes. On desktop the box floats over the page
// without blocking it (non-modal), so Tab may leave it; on phones it covers the
// screen (modal) and Tab stays inside.
const modal = ref(false);
function focusables(): HTMLElement[] {
  return [
    ...(panel.value?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) ?? []),
  ].filter((el) => el.offsetParent !== null || el === document.activeElement);
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.stopPropagation();
    closeAsk();
    return;
  }
  if (e.key !== "Tab" || !modal.value) return;
  const list = focusables();
  if (!list.length) return;
  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (e.shiftKey && (active === first || !panel.value?.contains(active))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

function onOpen() {
  modal.value = isPhone();
  const fine = window.matchMedia("(pointer: fine)").matches;
  nextTick(() => {
    if (fine) input.value?.focus();
    else panel.value?.focus();
    scrollToBottom();
    autosize();
  });
  if (isPhone()) document.documentElement.classList.add("lr-ask-lock");
  scrollSection.value = currentSection();
  window.addEventListener("scroll", trackSection, { passive: true });
  document.addEventListener("selectionchange", onSelectionChange);
}

function stopTracking() {
  window.removeEventListener("scroll", trackSection);
  document.removeEventListener("selectionchange", onSelectionChange);
  clearTimeout(selTimer);
}

// Opened (or re-focused) from "Ask AI about this page": the page chip comes back.
watch(askPageRequest, () => {
  pageDropped.value = false;
});
// Page-mode wording only while the page context is actually sent.
const pageMode = computed(() => askMode.value === "page" && showPageChip.value);

watch(askOpen, (open) => {
  if (open && askMode.value === "page") pageDropped.value = false;
  if (open) onOpen();
  else {
    document.documentElement.classList.remove("lr-ask-lock");
    stopTracking();
  }
});

// A new page: bring the page chip back, drop a selection from the old page,
// and read the new page's section once it has rendered.
watch(
  () => route.path,
  () => {
    pageDropped.value = false;
    setSelection(null);
    nextTick(() => setTimeout(() => (scrollSection.value = currentSection()), 100));
  }
);
watch(
  () => turns.length,
  () => persist()
);

onMounted(() => {
  loadDockPref();
  wideQuery = window.matchMedia(`(min-width: ${DOCK_MIN_WIDTH}px)`);
  onWide();
  wideQuery.addEventListener("change", onWide);
  document.documentElement.classList.toggle("lr-ask-docked", askOpen.value && docked.value);
  if (content.value) {
    resize = new ResizeObserver(() => {
      if (stick && askOpen.value) {
        const el = scroller.value;
        if (el) el.scrollTop = el.scrollHeight;
      }
    });
    resize.observe(content.value);
  }
  if (askOpen.value) onOpen();
});
onBeforeUnmount(() => {
  wideQuery?.removeEventListener("change", onWide);
  document.documentElement.classList.remove("lr-ask-docked");
  resize?.disconnect();
  controller?.abort();
  stopTracking();
  document.documentElement.classList.remove("lr-ask-lock");
});
</script>

<template>
  <Teleport to="body">
    <Transition name="lr-ask-slide">
      <section
        v-show="askOpen"
        ref="panel"
        class="lr-ask"
        :class="{ 'is-docked': docked }"
        role="dialog"
        :aria-modal="modal ? 'true' : 'false'"
        aria-labelledby="lr-ask-title"
        aria-describedby="lr-ask-note"
        tabindex="-1"
        @keydown="onKeydown"
      >
        <header class="lr-ask__head">
          <div class="lr-ask__titlerow">
            <h2 id="lr-ask-title" class="lr-ask__title"><PhIcon name="sparkle" />Ask AI</h2>
            <div class="lr-ask__actions">
              <button
                v-if="turns.length"
                type="button"
                class="lr-ask__iconbtn"
                aria-label="New chat"
                title="New chat"
                @click="newChat"
              >
                <PhIcon name="note-pencil" />
              </button>
              <button
                v-if="canDock"
                type="button"
                class="lr-ask__iconbtn"
                :aria-label="docked ? 'Shrink to a floating box' : 'Expand into a sidebar'"
                :title="docked ? 'Shrink to a box' : 'Expand into a sidebar'"
                :aria-pressed="docked"
                @click="setDocked(!askDocked)"
              >
                <PhIcon :name="docked ? 'arrows-in-simple' : 'sidebar-simple'" />
              </button>
              <button type="button" class="lr-ask__iconbtn" aria-label="Close Ask AI" title="Close" @click="closeAsk()">
                <PhIcon name="x" />
              </button>
            </div>
          </div>
        </header>

        <div ref="scroller" class="lr-ask__scroll" @scroll.passive="onScroll">
          <div ref="content" class="lr-ask__content">
            <div v-if="!turns.length" class="lr-ask-empty">
              <p v-if="pageMode" class="lr-ask-empty__intro">
                Ask about <strong>{{ pageTitle }}</strong>. Answers use this page first, then the rest of the docs.
              </p>
              <p v-else class="lr-ask-empty__intro">Ask a question about setting up or using Linkrunner.</p>
              <ul class="lr-ask-suggestions" aria-label="Suggested questions">
                <li v-for="s in suggestions" :key="s">
                  <button type="button" class="lr-ask-chip" @click="send(s)">{{ s }}</button>
                </li>
              </ul>
            </div>

            <template v-for="t in turns" :key="t.id">
              <div class="lr-ask-msg lr-ask-msg--user">
                <p class="lr-ask-bubble"><span class="lr-sr-only">You asked: </span>{{ t.question }}</p>
              </div>
              <div class="lr-ask-msg lr-ask-msg--ai">
                <div v-if="t.status === 'pending'" class="lr-ask-loader">
                  <span class="lr-ask-loader__dots" aria-hidden="true"><i /><i /><i /></span>
                  {{ t.sources.length ? "Writing an answer" : "Searching the docs" }}
                </div>

                <!-- Sanitised by renderMarkdown: html off, safe links only, no images. -->
                <div
                  v-if="t.answer"
                  class="lr-ask-md"
                  :class="{ 'is-streaming': t.status === 'streaming' }"
                  v-html="html(t)"
                  @click="onAnswerClick"
                />

                <p v-if="t.status === 'stopped'" class="lr-ask-meta">Stopped.</p>

                <div v-if="t.status === 'error' && t.error" class="lr-ask-error" role="alert">
                  <PhIcon name="warning" />
                  <div>
                    <p>{{ errorText(t.error) }}</p>
                    <div class="lr-ask-error__actions">
                      <button v-if="t.error.kind === 'busy'" type="button" class="lr-ask-btn" @click="openSearch">
                        <PhIcon name="magnifying-glass" />Search the docs
                      </button>
                      <button v-else-if="canRetry(t.error)" type="button" class="lr-ask-btn" :disabled="busy" @click="retry(t)">
                        <PhIcon name="arrows-clockwise" />Try again
                      </button>
                    </div>
                  </div>
                </div>

                <!-- One quiet row under the answer: sources folded into a count,
                     then icon-only copy and rating. Not covered or refused
                     (done.answered false): the sources are noise, so no count. -->
                <div v-if="showFooter(t)" class="lr-ask-foot">
                  <button
                    v-if="hasSources(t)"
                    type="button"
                    class="lr-ask-foot__sources"
                    :aria-expanded="!!t.sourcesOpen"
                    :aria-controls="`lr-ask-src-${t.id}`"
                    @click="toggleSources(t)"
                  >
                    {{ t.sources.length }} {{ t.sources.length === 1 ? "source" : "sources" }}
                    <PhIcon name="caret-down" />
                  </button>
                  <span class="lr-ask-foot__spacer" />
                  <template v-if="(t.status === 'done' || t.status === 'stopped') && t.answer">
                    <button
                      v-if="t.status === 'done' && t.answered === false"
                      type="button"
                      class="lr-ask-foot__btn lr-ask-foot__btn--text"
                      @click="openSearch"
                    >
                      <PhIcon name="magnifying-glass" />Search the docs
                    </button>
                    <button
                      type="button"
                      class="lr-ask-foot__btn"
                      :aria-label="t.copied ? 'Copied' : 'Copy answer'"
                      :title="t.copied ? 'Copied' : 'Copy answer'"
                      @click="copyAnswer(t)"
                    >
                      <PhIcon :name="t.copied ? 'check' : 'copy'" />
                    </button>
                    <template v-if="t.status === 'done' && t.questionId">
                      <button
                        type="button"
                        class="lr-ask-foot__btn lr-ask-rate"
                        :class="{ 'is-selected': t.rating === 1 }"
                        aria-label="Helpful"
                        title="Helpful"
                        :aria-pressed="t.rating === 1"
                        @click="rate(t, 1)"
                      >
                        <PhIcon name="thumbs-up" />
                      </button>
                      <button
                        type="button"
                        class="lr-ask-foot__btn lr-ask-rate"
                        :class="{ 'is-selected': t.rating === -1 }"
                        aria-label="Not helpful"
                        title="Not helpful"
                        :aria-pressed="t.rating === -1"
                        @click="rate(t, -1)"
                      >
                        <PhIcon name="thumbs-down" />
                      </button>
                    </template>
                  </template>
                </div>
                <ul v-if="hasSources(t) && t.sourcesOpen" :id="`lr-ask-src-${t.id}`" class="lr-ask-sources" aria-label="Sources">
                  <li v-for="s in t.sources" :key="s.url">
                    <a
                      :href="sourceHref(s)"
                      class="lr-ask-source"
                      :title="sourceLabel(s)"
                      :target="sourceExternal(s) ? '_blank' : undefined"
                      :rel="sourceExternal(s) ? 'noopener noreferrer' : undefined"
                      @click="goInternal($event, s.url)"
                    >
                      <span class="lr-ask-source__title">{{ s.title }}</span>
                      <PhIcon v-if="sourceExternal(s)" name="arrow-up-right" />
                    </a>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>

        <button
          v-if="!atBottom && turns.length"
          type="button"
          class="lr-ask-jump"
          aria-label="Scroll to the latest message"
          @click="scrollToBottom(true)"
        >
          <PhIcon name="arrow-down" />
        </button>

        <div v-if="showPageChip || askSelection" class="lr-ask-ctx" role="group" aria-label="Context sent with your question">
          <span v-if="showPageChip" class="lr-ask-ctx__chip">
            <PhIcon name="file-text" />
            <span class="lr-ask-ctx__text" :title="section ? `${pageTitle} › ${section}` : pageTitle">
              <span class="lr-ask-ctx__lead">Asking about</span> {{ pageTitle
              }}<template v-if="section"> › {{ section }}</template>
            </span>
            <button
              type="button"
              class="lr-ask-ctx__x"
              aria-label="Don't send this page with my questions"
              title="Don't send this page"
              @click="pageDropped = true"
            >
              <PhIcon name="x" />
            </button>
          </span>
          <span v-if="askSelection" class="lr-ask-ctx__chip">
            <PhIcon name="quotes" />
            <span class="lr-ask-ctx__text" :title="askSelection">
              <span class="lr-sr-only">Highlighted text: </span>“{{ askSelection }}”
            </span>
            <button
              type="button"
              class="lr-ask-ctx__x"
              aria-label="Don't send the highlighted text"
              title="Remove highlighted text"
              @click="setSelection(null)"
            >
              <PhIcon name="x" />
            </button>
          </span>
        </div>

        <form class="lr-ask-input" @submit.prevent="send()">
          <label for="lr-ask-q" class="lr-sr-only">Ask a question about Linkrunner</label>
          <textarea
            id="lr-ask-q"
            ref="input"
            v-model="draft"
            rows="1"
            :maxlength="MAX_QUESTION_CHARS"
            :placeholder="pageMode ? 'Ask about this page' : 'Ask a question about Linkrunner'"
            enterkeyhint="send"
            @keydown="onInputKey"
            @input="autosize"
          />
          <div class="lr-ask-input__bar">
            <span v-if="nearLimit" class="lr-ask-input__count">{{ draft.length }} / {{ MAX_QUESTION_CHARS }}</span>
            <button v-if="busy" type="button" class="lr-ask-send" aria-label="Stop answer" title="Stop" @click="stop">
              <PhIcon name="stop" />
            </button>
            <button
              v-else
              type="submit"
              class="lr-ask-send"
              aria-label="Send question"
              title="Send"
              :disabled="!draft.trim()"
            >
              <PhIcon name="arrow-up" />
            </button>
          </div>
        </form>
        <p id="lr-ask-note" class="lr-ask__note" title="Questions are saved to improve the docs.">AI can make mistakes. Verify important info.</p>

        <div class="lr-sr-only" aria-live="polite" aria-atomic="true">{{ announcement }}</div>
      </section>
    </Transition>
  </Teleport>
</template>
