/**
 * Fail the Relay build if a URL that worked on docs.linkrunner.io (Mintlify)
 * stops working here: every page, redirect, file and section anchor in
 * scripts/legacy-urls.json, plus the `/x/` and `/x.md` forms of each page.
 * Also checks that section links inside our own pages point at a real
 * section. Runs offline against .vitepress/dist-relay, serving files the way
 * firebase.json does (cleanUrls, trailingSlash: false) and following the
 * redirect stubs from gen-redirects.ts.
 *
 * Run (after the Relay build): bun run scripts/check-legacy-urls.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { RELAY_ANCHOR_ALIASES } from "../.vitepress/relay-content";

const ROOT = process.cwd();
const DIST = process.env.LEGACY_URLS_DIST ?? join(ROOT, ".vitepress/dist-relay");
type Inventory = {
  pages: { path: string; anchors: string[] }[];
  redirects: { source: string; destination: string }[];
  files: string[];
  platform: string[];
};
const inv: Inventory = JSON.parse(readFileSync(join(ROOT, "scripts/legacy-urls.json"), "utf8"));

const isFile = (rel: string) => existsSync(join(DIST, rel)) && statSync(join(DIST, rel)).isFile();
const unescape = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
/** Same as theme-relay/legacy-hash.ts. */
const loose = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** What Firebase Hosting answers for `path` with this repo's firebase.json. */
function serve(path: string): { file: string } | { redirect: string } | null {
  if (path.length > 1 && path.endsWith("/")) return { redirect: path.slice(0, -1) };
  if (path.endsWith(".html")) return { redirect: path.slice(0, -5) || "/" };
  const rel = decodeURI(path).slice(1);
  for (const f of path === "/" ? ["index.html"] : [rel, rel + ".html", rel + "/index.html"]) if (isFile(f)) return { file: f };
  return null;
}

type Stub = { to: string; hash: string; anchors: Record<string, string> };
const html = new Map<string, string>();
const read = (f: string) => html.get(f) ?? (html.set(f, readFileSync(join(DIST, f), "utf8")), html.get(f)!);
function stubOf(f: string): Stub | null {
  if (!f.endsWith(".html")) return null;
  const m = read(f).match(/<script>\(function\(\)\{var r=(\{.*?\});var h=/);
  return m ? JSON.parse(m[1]) : null;
}
const idCache = new Map<string, Set<string>>();
/**
 * The page's content (VitePress's .vp-doc), without the shell around it: an
 * id in the nav or sidebar must not stand in for a missing section.
 */
const contentOf = (f: string) => {
  const html = read(f);
  const start = html.search(/<div [^>]*class="vp-doc[ "]/);
  if (start < 0) return "";
  const end = html.indexOf("</main>", start);
  return html.slice(start, end < 0 ? undefined : end);
};
const idsOf = (f: string) =>
  idCache.get(f) ?? (idCache.set(f, new Set([...contentOf(f).matchAll(/\sid="([^"]*)"/g)].map((m) => unescape(m[1])))), idCache.get(f)!);

type Landing = { file: string; path: string; hash: string; hops: string[]; stubDefault: boolean };
/** Follow redirects and stubs the way a browser would. */
function land(url: string): Landing | string {
  const at = url.indexOf("#");
  let path = at < 0 ? url : url.slice(0, at);
  let hash = at < 0 ? "" : url.slice(at + 1);
  const hops: string[] = [];
  let stubDefault = false;
  for (let i = 0; i < 8; i++) {
    const r = serve(path);
    if (!r) return `404 at ${path}`;
    if ("redirect" in r) {
      hops.push(r.redirect);
      path = r.redirect;
      continue;
    }
    const stub = stubOf(r.file);
    if (!stub) return { file: r.file, path, hash, hops, stubDefault };
    const h = decode(hash);
    if (Object.prototype.hasOwnProperty.call(stub.anchors, h)) hash = stub.anchors[h];
    else if (stub.hash) {
      stubDefault = stubDefault || !!hash;
      hash = stub.hash.slice(1);
    }
    hops.push(stub.to + (hash ? "#" + hash : ""));
    path = stub.to;
  }
  return `redirect loop from ${url}`;
}

const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);
const stats = { pages: 0, redirected: 0, variants: 0, anchors: 0, sameId: 0, aliased: 0, mergedSection: 0, pageTop: 0, redirects: 0, files: 0, links: 0, looseLinks: 0 };

function checkPage(url: string, wantMd = false): Landing | null {
  const l = land(url);
  if (typeof l === "string") return fail(`${url}: ${l}`), null;
  if (wantMd ? !l.file.endsWith(".md") : !l.file.endsWith(".html")) return fail(`${url}: lands on ${l.file}`), null;
  if (!wantMd && l.file === "404.html") return fail(`${url}: lands on the 404 page`), null;
  return l;
}

for (const { path, anchors } of inv.pages) {
  const l = checkPage(path);
  if (!l) continue;
  stats.pages++;
  if (l.hops.length) stats.redirected++;
  for (const v of [path === "/" ? null : path + "/", path === "/" ? "/index.md" : path + ".md"]) {
    if (v && checkPage(v, v.endsWith(".md"))) stats.variants++;
  }
  const isRedirect = l.hops.length > 0;
  for (const a of anchors) {
    stats.anchors++;
    const la = land(`${path}#${a}`);
    if (typeof la === "string") {
      fail(`${path}#${a}: ${la}`);
      continue;
    }
    const ids = idsOf(la.file);
    if (la.hash && ids.has(la.hash)) {
      if (la.stubDefault) stats.mergedSection++;
      else if (la.hash === a) stats.sameId++;
      else stats.aliased++;
      continue;
    }
    // Same page: the theme maps renamed anchors (legacy-hash.ts).
    const alias = RELAY_ANCHOR_ALIASES[la.path]?.[a];
    if (!isRedirect && alias && ids.has(alias)) {
      stats.aliased++;
      continue;
    }
    if (alias) {
      fail(`${path}#${a}: alias "${alias}" is not an anchor on ${la.path}`);
      continue;
    }
    // A page whose content was merged or hidden (RELAY_REDIRECTS) may land
    // on the top of its new page; an anchor on a page that still exists may not.
    if (isRedirect) {
      stats.pageTop++;
      continue;
    }
    fail(`${path}#${a}: no element with this id on ${la.path} (add it to RELAY_ANCHOR_ALIASES)`);
  }
}

for (const { source, destination } of inv.redirects) {
  stats.redirects++;
  const want = land(destination);
  const got = checkPage(source);
  if (got && typeof want !== "string" && got.file !== want.file) fail(`${source}: lands on ${got.path}, docs.linkrunner.io sends it to ${destination}`);
  if (source !== "/") checkPage(source + ".md", true);
}

for (const f of inv.files) {
  stats.files++;
  if (!serve(f) || "redirect" in serve(f)!) fail(`${f}: file is missing (copy it into public/)`);
}

// Section links inside our own pages.
function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(join(DIST, dir))) {
    const rel = dir ? `${dir}/${e}` : e;
    if (e === "assets" || e === "images" || e === "og") continue;
    if (statSync(join(DIST, rel)).isDirectory()) walk(rel, out);
    else if (e.endsWith(".html") && e !== "404.html") out.push(rel);
  }
  return out;
}
const broken = new Map<string, Set<string>>();
for (const f of walk("")) {
  if (stubOf(f)) continue;
  const page = "/" + f.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
  const main = contentOf(f);
  // VitePress's outline decodes heading ids with decodeURIComponent and no
  // try/catch, so a "%" in one can break the "On this page" list.
  for (const m of main.matchAll(/<h[1-6]\b[^>]*?\sid="([^"]*%[^"]*)"/g)) fail(`${page}: heading id contains "%": ${unescape(m[1])}`);
  for (const m of main.matchAll(/<a\b[^>]*?\shref="(\/[^"#]*|)#([^"]+)"/g)) {
    const href = m[1] + "#" + m[2];
    const p = m[1] ? unescape(m[1]) : "";
    const h = unescape(m[2]);
    if (h.startsWith("lr-heading:")) {
      fail(`${page}: checklist link to a heading that wasn't found (${decode(h)})`);
      continue;
    }
    stats.links++;
    const target = land((p || page) + "#" + h);
    if (typeof target === "string") {
      (broken.get(page) ?? broken.set(page, new Set()).get(page)!).add(href);
      continue;
    }
    const ids = idsOf(target.file);
    const id = decode(target.hash);
    const alias = RELAY_ANCHOR_ALIASES[target.path]?.[id];
    if (ids.has(id) || (alias && ids.has(alias))) continue;
    // Mintlify-era spellings ("#step-4%3A-android-backup-configuration") that
    // the theme matches ignoring punctuation (legacy-hash.ts).
    if ([...ids].some((i) => loose(i) === loose(id))) {
      stats.looseLinks++;
      continue;
    }
    (broken.get(page) ?? broken.set(page, new Set()).get(page)!).add(href);
  }
}
for (const [page, hrefs] of broken)
  fail(`${page}: section link(s) to a missing anchor (fix the link upstream or add it to RELAY_ANCHOR_ALIASES): ${[...hrefs].join(", ")}`);

const summary =
  `${stats.pages} pages (${stats.redirected} redirected), ${stats.variants} /x/ and /x.md forms, ` +
  `${stats.anchors} anchors (${stats.sameId} same id, ${stats.aliased} renamed, ${stats.mergedSection} to their merged section, ${stats.pageTop} to the top of a merged or hidden page), ` +
  `${stats.redirects} redirects, ${stats.files} files, ${stats.links} in-page section links (${stats.looseLinks} matched ignoring punctuation)`;
if (failures.length) {
  console.error(`Legacy docs.linkrunner.io URLs: ${failures.length} problem(s):\n  ${failures.join("\n  ")}`);
  console.error(summary);
  process.exit(1);
}
console.log(`Legacy docs.linkrunner.io URLs all resolve: ${summary}.`);
// Agent files (llms.txt, robots.txt, ...) are built by agent-files.ts and
// checked by check-agent-files.ts; list only what is still missing.
const notServed = inv.platform.filter((p) => !existsSync(join(DIST, p)));
console.log(`Not served (Mintlify platform features, see README): ${notServed.join(", ") || "none"}`);
