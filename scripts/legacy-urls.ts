/**
 * Refresh scripts/legacy-urls.json: every URL docs.linkrunner.io (Mintlify)
 * serves, with the section anchors on each page. scripts/check-legacy-urls.ts
 * checks the Relay build against it, so links shared from the Mintlify site
 * keep working on docs.v2.
 *
 * Read-only fetches of the live site, at most 4 at a time.
 * Run: bun run scripts/legacy-urls.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://docs.linkrunner.io";
const ROOT = process.cwd();
const OUT = join(ROOT, "scripts/legacy-urls.json");

// Non-page files the Mintlify site serves from the docs repo and that pages
// link to. Platform endpoints (llms.txt, /mcp, ...) are listed separately.
const FILES = [
  "/api-reference/openapi.json",
  "/api-reference/reporting-campaigns.postman_collection.json",
  "/api-reference/reporting-web-campaigns.postman_collection.json",
];
const PLATFORM = ["/llms.txt", "/llms-full.txt", "/skill.md", "/sitemap.xml", "/robots.txt", "/mcp"];

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

async function get(path: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(SITE + path, { redirect: "manual", headers: { "user-agent": "linkrunner-docs-v2-legacy-urls" } });
    if (res.status < 500 || attempt === 2) return res;
    await Bun.sleep(1000 * (attempt + 1));
  }
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

/** Anchor ids in the page body: headings, accordions, tabs, explicit <span id>. */
function anchors(html: string): string[] {
  const start = html.indexOf('id="content"');
  const end = html.indexOf('id="pagination"', start);
  if (start < 0) throw new Error("no content area");
  const body = html.slice(start, end > 0 ? end : undefined);
  const ids: string[] = [];
  for (const m of body.matchAll(/<[a-zA-Z][\w-]*\b[^>]*?\sid="([^"]+)"/g)) {
    const id = decode(m[1]);
    // React useId values, Mintlify icon sprites, and the inner parts of
    // accordions and tabs that nothing links to.
    if (/^(_R_|base-ui-|mi-|panel-)/.test(id) || /-accordion-(title|children)$/.test(id)) continue;
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

const sitemap = await (await get("/sitemap.xml")).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/").sort();

const pages = await pool(paths, 4, async (path) => {
  const res = await get(path);
  if (res.status !== 200) throw new Error(`${path}: HTTP ${res.status}`);
  return { path, anchors: anchors(await res.text()) };
});

// Redirects: Mintlify docs.json (copied to .vitepress/redirects.json by
// convert.ts) plus the root, as the live site answers them.
const configured: { source: string; destination: string }[] = JSON.parse(readFileSync(join(ROOT, ".vitepress/redirects.json"), "utf8"));
const redirects = await pool(["/", ...configured.map((r) => r.source)], 4, async (source) => {
  const res = await get(source);
  const location = res.headers.get("location");
  if (res.status < 300 || res.status >= 400 || !location) throw new Error(`${source}: expected a redirect, got HTTP ${res.status}`);
  return { source, destination: new URL(location, SITE).pathname };
});

const files = await pool(FILES, 4, async (path) => ((await get(path)).status === 200 ? path : null));

writeFileSync(
  OUT,
  JSON.stringify(
    {
      about:
        "URLs served by docs.linkrunner.io (Mintlify). Refresh with `bun run scripts/legacy-urls.ts`; `bun run build:relay` fails if one stops resolving (scripts/check-legacy-urls.ts). See README.",
      site: SITE,
      fetched: new Date().toISOString().slice(0, 10),
      pages,
      redirects,
      files: files.filter(Boolean),
      platform: PLATFORM,
    },
    null,
    1
  ) + "\n"
);
const anchorCount = pages.reduce((n, p) => n + p.anchors.length, 0);
console.log(`legacy-urls.json: ${pages.length} pages, ${anchorCount} anchors, ${redirects.length} redirects, ${files.filter(Boolean).length} files.`);
