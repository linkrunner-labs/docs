<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import PhIcon from "./PhIcon.vue";
import { icons } from "../icons";

// Content images open full size in a dialog with a download button, and
// videos get a download link underneath. Markdown pages render plain <img>
// and <video> tags, so this decorates them after each page renders.
const dialog = ref<HTMLDialogElement>();
const src = ref("");
const alt = ref("");
let opener: HTMLElement | null = null;

const IMG = ".vp-doc img:not(a img):not(.lr-card img):not(.VPImage)";
// Icon markup comes from the bundled Phosphor set, never from page content.
function icon(name: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "lr-ph");
  svg.setAttribute("viewBox", icons[name].viewBox);
  svg.setAttribute("width", "1em");
  svg.setAttribute("height", "1em");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = icons[name].body;
  return svg;
}

const fileName = (url: string) => decodeURIComponent(url.split(/[?#]/)[0].split("/").pop() || "file");

function decorate() {
  for (const img of document.querySelectorAll<HTMLImageElement>(IMG)) {
    if (img.dataset.lrZoom) continue;
    img.dataset.lrZoom = "1";
    img.classList.add("lr-zoomable");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-haspopup", "dialog");
    img.setAttribute("aria-label", `View full size: ${img.alt || "image"}`);
  }
  for (const video of document.querySelectorAll<HTMLVideoElement>(".vp-doc video")) {
    const url = video.currentSrc || video.src || video.querySelector("source")?.src;
    if (!url || video.dataset.lrDownload) continue;
    video.dataset.lrDownload = "1";
    // Same-origin files download directly; hosted ones open in a new tab,
    // where the browser's player offers Save.
    const a = document.createElement("a");
    a.className = "lr-media-download";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("download", fileName(url));
    const label = document.createElement("span");
    label.textContent = "Download video";
    a.append(icon("download-simple"), label);
    video.insertAdjacentElement("afterend", a);
  }
}

function open(img: HTMLImageElement) {
  opener = img;
  src.value = img.currentSrc || img.src;
  alt.value = img.alt;
  dialog.value?.showModal();
}

function close() {
  dialog.value?.close();
}

function onClosed() {
  opener?.focus();
  opener = null;
}

function onClick(e: MouseEvent) {
  const img = (e.target as HTMLElement).closest?.<HTMLImageElement>("img.lr-zoomable");
  if (img) open(img);
}

function onKey(e: KeyboardEvent) {
  const img = e.target as HTMLElement;
  if ((e.key === "Enter" || e.key === " ") && img.matches?.("img.lr-zoomable")) {
    e.preventDefault();
    open(img as HTMLImageElement);
  }
}

// A click on the dimmed area outside the panel closes the viewer.
function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) close();
}

const route = useRoute();
onMounted(() => {
  decorate();
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);
});
watch(() => route.path, () => nextTick(() => setTimeout(decorate)));
onBeforeUnmount(() => {
  document.removeEventListener("click", onClick);
  document.removeEventListener("keydown", onKey);
});
</script>

<template>
  <dialog
    ref="dialog"
    class="lr-media-viewer"
    :aria-label="alt ? `Image: ${alt}` : 'Image'"
    @click="onBackdrop"
    @close="onClosed"
  >
    <div class="lr-media-viewer__bar">
      <p class="lr-media-viewer__title">{{ alt || "Image" }}</p>
      <a class="lr-media-viewer__btn" :href="src" :download="fileName(src)">
        <PhIcon name="download-simple" />
        <span>Download</span>
      </a>
      <button type="button" class="lr-media-viewer__btn lr-media-viewer__close" aria-label="Close image" @click="close">
        <PhIcon name="x" />
      </button>
    </div>
    <div class="lr-media-viewer__body">
      <img v-if="src" :src="src" :alt="alt" />
    </div>
  </dialog>
</template>
