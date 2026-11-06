/**
 * Check the agent files in the Relay build (.vitepress/agent-files.ts):
 * - every link in llms.txt is a built Markdown page, and every built page is listed,
 * - llms-full.txt parses with the Linkrunner MCP's parser (search_documentation,
 *   linkrunner-labs/mcp-server src/tools/documentation.ts) into one entry per
 *   page, under its 2 MB cap,
 * - robots.txt, sitemap.xml, skill.md and the .well-known copies exist,
 * - pages link their Markdown copy.
 * Run after `DOCS_THEME=relay vitepress build` (part of build:relay).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { SITE_URL } from "../.vitepress/og";
import { MAIN_SITE } from "../.vitepress/site";

const DIST = join(process.cwd(), ".vitepress/dist-relay");
const read = (f: string) => readFileSync(join(DIST, f), "utf8");
const errors: string[] = [];
const fail = (m: string) => errors.push(m);

// Built pages: <route>.md files that have a matching .html page (redirect
// stubs get a .md copy too, but they are not pages of their own).
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const isStub = (html: string) => html.includes("<title>Redirecting…</title>");
const pages = walk(DIST)
  .filter((f) => f.endsWith(".md") && existsSync(f.replace(/\.md$/, ".html")))
  .filter((f) => !isStub(readFileSync(f.replace(/\.md$/, ".html"), "utf8")))
  .map((f) => "/" + relative(DIST, f));

for (const f of ["llms.txt", ".well-known/llms.txt", "llms-full.txt", "skill.md", ".well-known/skills/linkrunner/SKILL.md", ".well-known/skills/index.json", "robots.txt", "sitemap.xml"]) {
  if (!existsSync(join(DIST, f))) fail(`missing ${f}`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

// llms.txt links.
const llms = read("llms.txt");
const linked = [...llms.matchAll(/^- \[[^\]]+\]\((\S+?)\)/gm)].map((m) => m[1]);
const linkedMd = new Set(linked.filter((u) => u.endsWith(".md")).map((u) => u.slice(SITE_URL.length)));
for (const u of linked) {
  if (!u.startsWith(SITE_URL + "/")) fail(`llms.txt: ${u} is not on ${SITE_URL}`);
  else if (!existsSync(join(DIST, u.slice(SITE_URL.length)))) fail(`llms.txt: ${u} is not in the build`);
}
for (const p of pages) if (!linkedMd.has(p)) fail(`llms.txt: ${p} is not listed`);
if (read(".well-known/llms.txt") !== llms) fail(".well-known/llms.txt differs from llms.txt");
// Empty when gen-nav ran against a docs checkout without markdown.instructions.
if (!llms.includes("> ## Agent Instructions")) fail("llms.txt: no agent instructions (nav.json agentInstructions is empty)");

// llms-full.txt, parsed the way the MCP does (host check uses our SITE_URL).
const full = read("llms-full.txt");
const bytes = Buffer.byteLength(full);
if (bytes > 2_000_000) fail(`llms-full.txt is ${bytes} bytes; the MCP reads at most 2,000,000`);
const host = new URL(SITE_URL).hostname;
// The MCP cuts a page at the next header of any host, so count them all.
const headers = [...full.matchAll(/^# (.+)\r?\nSource: (https:\/\/[^\s]+)\r?\n/gm)];
if (headers.length !== pages.length) fail(`llms-full.txt: ${headers.length} "# Title / Source:" headers, expected ${pages.length}`);
const entries = headers.filter((m) => {
  try {
    return new URL(m[2]).hostname === host;
  } catch {
    return false;
  }
});
const sources = new Set(entries.map((m) => new URL(m[2]).pathname));
if (entries.length !== pages.length) fail(`llms-full.txt: ${entries.length} parsed pages, expected ${pages.length}`);
for (const p of pages) {
  const route = p === "/index.md" ? "/" : p.replace(/\.md$/, "");
  if (!sources.has(route)) fail(`llms-full.txt: no "Source: ${SITE_URL}${route === "/" ? "/" : route}" entry`);
}

// Sitemap: every page, no redirect stubs.
const sitemap = read("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== pages.length) fail(`sitemap.xml: ${locs.length} URLs, expected ${pages.length}`);
if (!read("robots.txt").includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail("robots.txt: no Sitemap line");

// Search engines: the preview is noindex in both the page and the header;
// the main site in neither, and names itself as the canonical address.
const noindexMeta = read("index.html").includes('name="robots" content="noindex, nofollow"');
const noindexHeader = /"key":\s*"X-Robots-Tag",\s*"value":\s*"noindex/.test(readFileSync(join(process.cwd(), "firebase.json"), "utf8"));
if (MAIN_SITE && (noindexMeta || noindexHeader)) fail("MAIN_SITE is on, but the robots noindex meta or the firebase.json X-Robots-Tag header is still there");
if (!MAIN_SITE && !(noindexMeta && noindexHeader)) fail("the docs.v2 preview must send noindex in both the robots meta and firebase.json X-Robots-Tag");
if (MAIN_SITE && !read("quickstart.html").includes(`<link rel="canonical" href="${SITE_URL}/quickstart">`)) fail("quickstart.html: no canonical link");

// Pages link their Markdown copy.
for (const [html, md] of [["index.html", "/index.md"], ["quickstart.html", "/quickstart.md"], ["sdk/android.html", "/sdk/android.md"]]) {
  if (!read(html).includes(`<link rel="alternate" type="text/markdown" href="${md}">`)) fail(`${html}: no Markdown alternate link`);
}

if (errors.length) {
  console.error(`Agent files: ${errors.length} problem(s)\n` + errors.map((e) => `  ${e}`).join("\n"));
  process.exit(1);
}
console.log(
  `Agent files OK: llms.txt lists ${pages.length} pages, llms-full.txt ${entries.length} pages (${(bytes / 1e6).toFixed(2)} MB), sitemap ${locs.length} URLs.`
);
