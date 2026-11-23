/**
 * Relay-only source rewrites, applied to each page's Markdown before it is
 * parsed (so the page, its outline and the search index all see them):
 * - swaps the H1 for the plainer title in relay-content.ts,
 * - adds the "Before you start" box under the intro when the page has one,
 * - folds the embedded setup video into a "Watch the setup video" disclosure
 *   so the first step is on screen,
 * - on SDK guides with required steps, adds a checklist of the required and
 *   optional sections,
 * - drops sentences that only point at hidden pages (RELAY_REMOVED_TEXT),
 * - points links at merged pages to where the content lives now (the redirect
 *   stubs only catch full page loads, not in-site navigation).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PAGE_TITLES, RELAY_REDIRECTS, RELAY_REMOVED_TEXT } from "./relay-content";
import { HEADING_REF } from "./legacy-anchors";

const beforeYouStart: Record<string, unknown> = JSON.parse(
  readFileSync(fileURLToPath(new URL("./relay-before-you-start.json", import.meta.url)), "utf8")
);

/** "sdk/flutter.md" -> "/sdk/flutter". */
export const routeOf = (relativePath: string) =>
  "/" + relativePath.replace(/^relay-pages\//, "").replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "").replace(/\/$/, "");

const REQUIRED = /\(required\)|^requirements$|^installation$/i;
const REFERENCE = /^(function placement guide|complete example|next steps|support)$/i;

function checklist(src: string): string {
  const heads = [...src.matchAll(/^## (.+)$/gm)].map((m) => {
    const raw = m[1].trim();
    const id = raw.match(/\{#([^}\s]+)[^}]*\}\s*$/)?.[1];
    const text = raw.replace(/\s*\{[^}]*\}\s*$/, "");
    // The heading's id is only known once the page is parsed: legacy-anchors.ts
    // swaps this reference for it.
    return { text, id: id ?? HEADING_REF + encodeURIComponent(text) };
  });
  if (!heads.some((h) => /\(required\)/i.test(h.text))) return "";
  const label = (t: string) => t.replace(/\s*\((required|optional)\)/i, "");
  const link = (h: { text: string; id: string }) => `<a href="#${h.id}">${label(h.text)}</a>`;
  const required = heads.filter((h) => REQUIRED.test(h.text));
  const optional = heads.filter((h) => !REQUIRED.test(h.text) && !REFERENCE.test(h.text));
  return `
<div class="lr-checklist">
<p class="lr-checklist__row"><span class="lr-checklist__title">Required</span><span class="lr-checklist__items">${required.map(link).join("")}</span></p>
<p class="lr-checklist__row"><span class="lr-checklist__title">Optional</span><span class="lr-checklist__items">${optional.map(link).join("")}</span></p>
</div>
`;
}


const VIDEO_RE = /<div class="video-container"[^>]*>\s*(<iframe[\s\S]*?<\/iframe>)\s*<\/div>/;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const MERGED_LINK = new RegExp(
  `(\\]\\(|href=")(${Object.keys(RELAY_REDIRECTS).map(escapeRe).join("|")})(#[^)"\\s]*)?(?=[)"\\s])`,
  "g"
);

export function rewrite(src: string, relativePath: string): string {
  const route = routeOf(relativePath);
  for (const text of RELAY_REMOVED_TEXT[route] ?? []) {
    if (!src.includes(text)) throw new Error(`relay-markdown: text to remove not found in ${route}: ${text.slice(0, 60)}`);
    src = src.replace(text, "");
  }
  src = src.replace(MERGED_LINK, (_, open: string, from: string, hash = "") => {
    const to = RELAY_REDIRECTS[from];
    return open + (to.includes("#") ? to : to + hash);
  });
  const title = PAGE_TITLES[route]?.title;
  if (title) src = src.replace(/^# .+$/m, `# ${title}`);

  let after = "";
  if (beforeYouStart[route]) after += `\n<BeforeYouStart />\n`;
  if (route.startsWith("/sdk/")) after += checklist(src);

  const video = src.match(VIDEO_RE);
  if (video) {
    const iframe = video[1].replace("<iframe", '<iframe loading="lazy"');
    src = src.replace(
      VIDEO_RE,
      `<details class="lr-video"><summary>Watch the setup video</summary>\n<div class="lr-video__frame">${iframe}</div>\n</details>`
    );
  }

  if (after) {
    // After the intro paragraph, or straight after the H1.
    const lead = src.match(/^<p class="vp-lead">.*<\/p>$/m) ?? src.match(/^# .+$/m);
    if (lead?.index != null) {
      const at = lead.index + lead[0].length;
      src = src.slice(0, at) + "\n" + after + src.slice(at);
    }
  }
  return src;
}
