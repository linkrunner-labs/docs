/**
 * Generate static redirect stub pages in the build output, one per entry in
 * Mintlify's docs.json `redirects`. Preserves old/bookmarked URLs so external
 * inbound links don't 404. Run after `vitepress build`.
 *
 * - A section link to an old page (/features/remarketing-campaigns#steps)
 *   lands on the same section of the page that has its content now: the
 *   stub keeps the anchor when the new page has it, or uses
 *   RELAY_ANCHOR_ALIASES (relay-content.ts), else the redirect's own anchor.
 * - /old.md gets a copy of the new page's Markdown (Mintlify served page.md
 *   and redirected old .md URLs too).
 *
 * Run: bun run scripts/gen-redirects.ts
 * The Relay build writes to .vitepress/dist-relay (DOCS_THEME=relay).
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

// Run from the repo root (locally and in CI). Reads the committed redirects
// list so it doesn't depend on the Mintlify source.
const ROOT = process.cwd();
const REDIRECTS_JSON = join(ROOT, ".vitepress/redirects.json");
const RELAY = process.env.DOCS_THEME === "relay";
const DIST = join(ROOT, RELAY ? ".vitepress/dist-relay" : ".vitepress/dist");

const redirects: { source: string; destination: string }[] = JSON.parse(
  readFileSync(REDIRECTS_JSON, "utf8")
);

// The Relay build merges some pages (.vitepress/relay-content.ts); their old
// URLs redirect to where the content lives now.
let aliases: Record<string, Record<string, string>> = {};
if (RELAY) {
  const { RELAY_REDIRECTS, RELAY_ANCHOR_ALIASES } = await import("../.vitepress/relay-content");
  for (const [source, destination] of Object.entries(RELAY_REDIRECTS)) redirects.push({ source, destination });
  aliases = RELAY_ANCHOR_ALIASES;
}

// Section anchors each docs.linkrunner.io page had (scripts/legacy-urls.ts).
const legacy = new Map<string, string[]>(
  JSON.parse(readFileSync(join(ROOT, "scripts/legacy-urls.json"), "utf8")).pages.map((p: { path: string; anchors: string[] }) => [
    p.path,
    p.anchors,
  ])
);

const decode = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const fileOf = (path: string) => join(DIST, path === "/" ? "index.html" : path.slice(1) + ".html");

function idsOf(path: string): Set<string> {
  const file = fileOf(path);
  if (!existsSync(file)) return new Set();
  return new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]*)"/g)].map((m) => decode(m[1])));
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * The description, Open Graph and Twitter tags of the built page at `path`.
 * Link previews (Slack, WhatsApp, LinkedIn, X) read the stub itself and don't
 * follow its redirect, so the stub carries the destination's preview.
 */
function shareTagsOf(path: string): string[] {
  const file = fileOf(path);
  if (!existsSync(file)) return [];
  const head = readFileSync(file, "utf8").split("</head>")[0];
  // content="…" is matched whole: VitePress doesn't escape ">" in the description.
  return head.match(/<meta\s+(?:property="og:[^"]*"|name="twitter:[^"]*"|name="description")\s+content="[^"]*"\s*\/?>/g) ?? [];
}

/**
 * `r` is read back by scripts/check-legacy-urls.ts: `to` path, `hash` the
 * redirect's own anchor (or ""), `anchors` old anchor -> anchor on `to`.
 */
function stub(to: string, hash: string, anchors: Record<string, string>, share: string[]): string {
  const dest = to + hash;
  const r = JSON.stringify({ to, hash, anchors }).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${escapeHtml(dest)}">
<link rel="canonical" href="${escapeHtml(dest)}">
<meta name="robots" content="noindex">
${share.map((t) => t + "\n").join("")}<title>Redirecting…</title>
<script>(function(){var r=${r};var h=location.hash.slice(1);try{h=decodeURIComponent(h)}catch(e){}var a=Object.prototype.hasOwnProperty.call(r.anchors,h)?"#"+r.anchors[h]:r.hash||location.hash;location.replace(r.to+a)})()</script>
</head>
<body>Redirecting to <a href="${escapeHtml(dest)}">${escapeHtml(dest)}</a>…</body>
</html>
`;
}

let n = 0;
let md = 0;
for (const { source, destination } of redirects) {
  const [to, rawHash] = destination.split("#");
  const hash = rawHash ? `#${rawHash}` : "";
  const ids = idsOf(to);
  const anchors: Record<string, string> = {};
  for (const a of legacy.get(source) ?? []) {
    const target = aliases[source]?.[a] ?? (ids.has(a) ? a : undefined);
    // Only what the default (the redirect's anchor, or the same anchor) gets wrong.
    if (target !== undefined && target !== (rawHash ?? a)) anchors[a] = target;
  }
  const rel = source.replace(/^\//, "").replace(/\/$/, "");
  const file = join(DIST, rel + ".html");
  mkdirSync(dirname(file), { recursive: true });
  const share = shareTagsOf(to);
  // Every Relay page has share tags (og.ts); none means `to` isn't built.
  if (RELAY && !share.some((t) => t.includes('property="og:title"'))) {
    throw new Error(`${source}: no share tags on ${to}. Is it a built page?`);
  }
  writeFileSync(file, stub(to, hash, anchors, share));
  n++;

  const fromMd = join(DIST, rel + ".md");
  const toMd = join(DIST, to === "/" ? "index.md" : to.slice(1) + ".md");
  if (existsSync(toMd) && !existsSync(fromMd)) {
    copyFileSync(toMd, fromMd);
    md++;
  }
}

console.log(`Wrote ${n} redirect stub(s) and ${md} Markdown copies to dist.`);
