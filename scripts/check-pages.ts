/**
 * Page rules from AGENTS.md, checked on every page docs.v2 serves so new and
 * edited pages stay consistent. Run: bun run check:pages
 *
 * Source rules (generated pages and relay-pages/, minus what docs.v2 doesn't serve):
 * - frontmatter: a non-empty `title` and `description`.
 * - em-dash: no em dashes outside code, frontmatter included.
 * - docs-link: product-doc links are root-relative (`/sdk/android`), not
 *   https://docs.linkrunner.io/... or docs.v2. Downloadable files may use the full URL.
 * - relative-link: no `./page`, `../page` or bare `page` links.
 * - support-line: the page ends with a way to reach support@linkrunner.io.
 * - image: every /images/... and /samples/... file a page uses exists in public/.
 * - tab-order: platform tabs follow Android, iOS, React Native, Flutter,
 *   Expo, Capacitor, Cordova, Web, Unity.
 * - relay-page: every file in relay-pages/ is listed in RELAY_PAGES (otherwise
 *   it is published at /relay-pages/<route>).
 * - sidebar: every page is in the docs.v2 sidebar (.vitepress/relay-nav.ts).
 * - component-markdown: a component tag such as <Note> on its own line is
 *   followed by a blank line, and Markdown inside a one-line component goes on
 *   its own lines, or VitePress shows the Markdown as plain text.
 * Built-site rule, with --built (build:relay passes it after building):
 * - internal-link: every root-relative link in a page body resolves to a page,
 *   a redirect or a file.
 * - raw-markdown: no Markdown link or bold syntax shows as plain text in a page.
 *
 * Gaps that already existed are counted per page and rule in
 * scripts/check-pages-baseline.json. The count may only go down: one more
 * problem on a listed page fails, and so does a count that went down without
 * updating the file. `--update-baseline` lowers or removes entries;
 * `--update-baseline --allow-new` may also add them (only for a sync that brings
 * in pages you can't fix here; fix them upstream where you can).
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { RELAY_PAGES, RELAY_REMOVED } from "../.vitepress/relay-content";
import { relaySidebars } from "../.vitepress/relay-nav";

const ROOT = process.cwd();
const DIST = join(ROOT, ".vitepress/dist-relay");
const BASELINE = join(ROOT, "scripts/check-pages-baseline.json");
const args = new Set(process.argv.slice(2));
const BUILT = args.has("--built");
// Top-level folders that hold no docs pages.
const SKIP_TOP = new Set(["node_modules", "public", "scripts", "skills"]);
const SKIP_FILES = new Set(["README.md", "AGENTS.md", "CLAUDE.md"]);
const PLATFORMS = ["Android", "iOS", "React Native", "Flutter", "Expo", "Capacitor", "Cordova", "Web", "Unity"];

type Rule = "frontmatter" | "em-dash" | "docs-link" | "relative-link" | "support-line" | "image" | "tab-order" | "relay-page" | "sidebar" | "internal-link" | "component-markdown" | "raw-markdown";
type Baseline = Partial<Record<Rule, Record<string, number>>>;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(join(ROOT, dir))) {
    const rel = dir ? `${dir}/${e}` : e;
    if (e.startsWith(".") || (!dir && SKIP_TOP.has(e))) continue;
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out);
    else if (e.endsWith(".md") && !SKIP_FILES.has(e)) out.push(rel);
  }
  return out;
}

/** Text outside fenced code, inline code and <pre>/<code> HTML, keeping line numbers. */
function prose(body: string): string {
  let fence: string | null = null;
  return body
    .split("\n")
    .map((line) => {
      const f = line.match(/^\s*(`{3,}|~{3,})/);
      if (fence) {
        if (f && f[1][0] === fence[0] && f[1].length >= fence.length && !line.trim().slice(f[1].length).trim()) fence = null;
        return "";
      }
      if (f) {
        fence = f[1];
        return "";
      }
      return line.replace(/(`+)[^`\n][\s\S]*?\1/g, "``").replace(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/g, "");
    })
    .join("\n")
    .replace(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/g, (m) => "\n".repeat(m.split("\n").length - 1));
}

// rule -> file -> problems
const found = new Map<Rule, Map<string, string[]>>();
const hit = (rule: Rule, file: string, detail: string) => {
  const byFile = found.get(rule) ?? found.set(rule, new Map()).get(rule)!;
  (byFile.get(file) ?? byFile.set(file, []).get(file)!).push(detail);
};
const lineOf = (text: string, index: number) => text.slice(0, index).split("\n").length;
const routeOf = (file: string) => {
  const p = "/" + file.replace(/^relay-pages\//, "").replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
  return p.length > 1 ? p.replace(/\/$/, "") : p;
};

// docs.v2 serves relay-pages/<p> instead of <p>, and doesn't serve merged or
// hidden pages (relay-content.ts), so those sources aren't checked.
const notServed = new Set([...RELAY_PAGES, ...RELAY_REMOVED]);
const all = walk("");
const pages = all.filter((f) => !notServed.has(f)).sort();

for (const f of all.filter((f) => f.startsWith("relay-pages/"))) {
  if (!RELAY_PAGES.includes(f.slice("relay-pages/".length))) hit("relay-page", f, `add "${f.slice("relay-pages/".length)}" to RELAY_PAGES in .vitepress/relay-content.ts`);
}

const inSidebar = new Set<string>();
const collect = (items: { link?: string; items?: unknown[] }[] = []) => {
  for (const it of items) {
    if (it.link) inSidebar.add(it.link.replace(/#.*$/, "").replace(/\/$/, "") || "/");
    collect(it.items as typeof items);
  }
};
relaySidebars.flat().forEach((g) => collect(g.items));

for (const file of pages) {
  const src = readFileSync(join(ROOT, file), "utf8");
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  const head = fm?.[1] ?? "";
  let data: Record<string, unknown> = {};
  try {
    data = (parseYaml(head) as Record<string, unknown>) ?? {};
  } catch (e) {
    hit("frontmatter", file, `frontmatter is not valid YAML: ${(e as Error).message.split("\n")[0]}`);
  }
  for (const key of ["title", "description"]) {
    const value = data[key];
    if (typeof value !== "string" || !value.trim()) hit("frontmatter", file, `no ${key} in frontmatter`);
  }
  for (const _ of head.matchAll(/\u2014/g)) hit("em-dash", file, "frontmatter: em dash");
  if (!inSidebar.has(routeOf(file))) hit("sidebar", file, `${routeOf(file)} is not in the docs.v2 sidebar (.vitepress/relay-nav.ts)`);

  const body = fm ? src.slice(fm[0].length) : src;
  const text = prose(body);
  const offset = fm ? fm[0].split("\n").length - 1 : 0;
  const at = (i: number) => `line ${lineOf(text, i) + offset}`;

  for (const m of text.matchAll(/\u2014/g)) hit("em-dash", file, `${at(m.index!)}: em dash (split the sentence or use a comma)`);

  // A component tag on its own line starts an HTML block that runs to the next blank line,
  // so Markdown written right below the tag is not rendered.
  const textLines = text.split("\n");
  const rawLines = body.split("\n");
  textLines.forEach((line, i) => {
    const raw = rawLines[i] ?? "";
    const oneLine = raw.match(/^\s*<(Note|Tip|Warning|Info|Check|Accordion|Step)(\s[^>]*)?>(.*\S.*)<\/\1>\s*$/);
    if (oneLine && /\*\*|\]\(|`/.test(oneLine[3]))
      hit("component-markdown", file, `line ${i + 1 + offset}: put the Markdown inside <${oneLine[1]}> on its own lines, with blank lines around it`);
    const tag = line.match(/^\s*<(Note|Tip|Warning|Info|Check|Accordion|Step|Tab|Card|Expandable)(\s[^>]*)?>\s*$/);
    const next = rawLines[i + 1] ?? "";
    if (tag && next.trim() && !/^\s*<\/?[A-Z][A-Za-z]*(\s[^>]*)?\/?>\s*$/.test(next))
      hit("component-markdown", file, `line ${i + 1 + offset}: add a blank line after <${tag[1]}> and do not indent its content`);
  });

  // Downloadable files (a Postman collection) keep their full URL.
  const isFile = (path = "") => /\.(?!md\b|html\b)[a-z\d]+$/i.test(path.split(/[?#]/)[0]);
  for (const m of text.matchAll(/(?:\]\(|href=["']|<)(https?:\/\/docs(?:\.v2)?\.linkrunner\.io(\/[^)"'>\s]*)?)/g))
    if (!isFile(m[2])) hit("docs-link", file, `${at(m.index!)}: use ${m[2] || "/"} instead of ${m[1]}`);

  for (const m of text.matchAll(/(?:\]\(|href=["'])(?![a-z][a-z\d+.-]*:|\/|#|["'])([^)"'\s]+)/gi))
    hit("relative-link", file, `${at(m.index!)}: ${m[1]} is relative; use a root-relative route`);
  // Reference-style link definitions: [guide]: /features/x
  for (const m of text.matchAll(/^ {0,3}\[[^\]\n]+\]:\s*<?([^\s>]+)>?/gm)) {
    const docs = m[1].match(/^https?:\/\/docs(?:\.v2)?\.linkrunner\.io(\/\S*)?/);
    if (docs && !isFile(docs[1])) hit("docs-link", file, `${at(m.index!)}: use ${docs[1] || "/"} instead of ${m[1]}`);
    else if (!/^[a-z][a-z\d+.-]*:|^\/|^#/i.test(m[1])) hit("relative-link", file, `${at(m.index!)}: ${m[1]} is relative; use a root-relative route`);
  }

  const tail = text.trimEnd().split("\n").slice(-12).join("\n");
  if (!/support@linkrunner\.io/.test(tail)) hit("support-line", file, "end the page with **Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).");

  for (const m of text.matchAll(/(?:\]\(|src=["']|href=["']|icon=["'])(\/(?:images|samples)\/[^)"'\s#?]+)/g)) {
    let path = m[1];
    try {
      path = decodeURI(path);
    } catch {
      // Malformed escape: check the raw path.
    }
    if (!existsSync(join(ROOT, "public", path))) hit("image", file, `${at(m.index!)}: ${m[1]} is not in public/`);
  }

  // Platform tab order, per <Tabs> group (nested groups are checked on their own).
  const stack: { index: number; titles: string[] }[] = [];
  for (const m of text.matchAll(/<(\/?)Tabs?\b([^>]*)>/g)) {
    const [, close, attrs] = m;
    const isGroup = m[0].startsWith("<Tabs") || m[0].startsWith("</Tabs");
    if (isGroup && !close) stack.push({ index: m.index!, titles: [] });
    else if (isGroup && close) {
      const g = stack.pop();
      if (!g) continue;
      const order = g.titles.map((t) => PLATFORMS.indexOf(t)).filter((i) => i >= 0);
      if (order.some((v, i) => i > 0 && v < order[i - 1]))
        hit("tab-order", file, `${at(g.index)}: tabs ${g.titles.join(", ")}; platform order is ${PLATFORMS.join(", ")}`);
    } else if (!close && stack.length) {
      const title = attrs.match(/\btitle=["']([^"']+)["']/)?.[1].trim();
      if (title) stack[stack.length - 1].titles.push(title);
    }
  }
}

// Links in the built pages (Markdown and components alike).
if (BUILT) {
  if (!existsSync(join(DIST, "index.html"))) {
    console.error("check-pages --built: no .vitepress/dist-relay; run build:relay.");
    process.exit(1);
  }
  const resolves = (path: string) => {
    const p = path.replace(/\/$/, "") || "/";
    if (p === "/") return existsSync(join(DIST, "index.html"));
    return [p + ".html", p + "/index.html", p].some((f) => existsSync(join(DIST, f)) && statSync(join(DIST, f)).isFile());
  };
  const byRoute = new Map(pages.map((p) => [routeOf(p), p]));
  const html = (dir: string, out: string[] = []): string[] => {
    for (const e of readdirSync(join(DIST, dir))) {
      const rel = dir ? `${dir}/${e}` : e;
      if (["assets", "images", "og", "samples", ".well-known"].includes(e)) continue;
      if (statSync(join(DIST, rel)).isDirectory()) html(rel, out);
      else if (e.endsWith(".html") && e !== "404.html") out.push(rel);
    }
    return out;
  };
  for (const f of html("")) {
    const page = readFileSync(join(DIST, f), "utf8");
    if (page.includes("<title>Redirecting…</title>")) continue;
    const src = byRoute.get(routeOf(f.replace(/\.html$/, ".md")));
    if (!src) continue; // not a docs page (for example a generated index)
    const main = page.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? "";
    const visible = main
      .replace(/<(pre|code|script|style)\b[^>]*>[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&");
    for (const m of visible.matchAll(/\[[^\]\n]{1,120}\]\((?:\/|#|https?:|mailto:)[^)\s]*\)|\*\*[^*\n]{1,80}\*\*/g))
      hit("raw-markdown", src, `shows Markdown as plain text: ${m[0].slice(0, 80)}`);
    for (const m of main.matchAll(/<a\b[^>]*?\shref="(\/[^"#?]*)/g)) {
      if (m[1].startsWith("//")) continue;
      let path = m[1];
      try {
        path = decodeURIComponent(path);
      } catch {
        // Malformed escape: check the raw path.
      }
      if (!resolves(path)) hit("internal-link", src, `links to ${m[1]}, which is not a page, redirect or file`);
    }
  }
}

// Compare with the baseline.
const baseline: Baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
const checked = (rule: string) => rule !== "internal-link" || BUILT;
const count = (rule: Rule, file: string) => found.get(rule)?.get(file)?.length ?? 0;

const worse: string[] = [];
const better: string[] = [];
const rules = new Set<Rule>([...found.keys(), ...(Object.keys(baseline) as Rule[])]);
for (const rule of rules) {
  if (!checked(rule)) continue;
  const files = new Set([...(found.get(rule)?.keys() ?? []), ...Object.keys(baseline[rule] ?? {})]);
  for (const file of files) {
    const known = baseline[rule]?.[file] ?? 0;
    const now = count(rule, file);
    if (now > known) {
      const details = found.get(rule)!.get(file)!;
      worse.push(`  ${file} [${rule}] ${known ? `${now} problems, ${known} known:` : ""} ${details.slice(known ? 0 : 0, 3).join("; ")}${details.length > 3 ? ` (+${details.length - 3} more)` : ""}`);
    } else if (now < known) better.push(`  ${file} [${rule}] ${known} known, ${now} now`);
  }
}

if (args.has("--update-baseline")) {
  const allowNew = args.has("--allow-new");
  const next: Baseline = {};
  for (const rule of rules) {
    const out: Record<string, number> = {};
    const files = new Set([...(found.get(rule)?.keys() ?? []), ...Object.keys(baseline[rule] ?? {})]);
    for (const file of [...files].sort()) {
      const known = baseline[rule]?.[file] ?? 0;
      const n = checked(rule) ? (allowNew ? count(rule, file) : Math.min(count(rule, file), known)) : known;
      if (n > 0) out[file] = n;
    }
    if (Object.keys(out).length) next[rule] = out;
  }
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + "\n");
  const left = Object.values(next).reduce((n, files) => n + Object.values(files!).reduce((a, b) => a + b, 0), 0);
  console.log(`check-pages: baseline rewritten, ${left} known problem(s).`);
  if (worse.length && !allowNew) {
    console.error(`check-pages: ${worse.length} new problem(s) were not added (fix them, or pass --allow-new for a sync you can't fix here):\n${worse.join("\n")}`);
    process.exit(1);
  }
  process.exit(0);
}

if (worse.length || better.length) {
  if (worse.length) console.error(`check-pages: new page rule problems (see AGENTS.md, Writing rules and Repository conventions):\n${worse.join("\n")}`);
  if (better.length) console.error(`check-pages: fewer problems than scripts/check-pages-baseline.json lists. Lower it with \`bun run check:pages -- --update-baseline\`:\n${better.join("\n")}`);
  process.exit(1);
}
const left = Object.entries(baseline).map(([r, files]) => `${r} ${Object.values(files!).reduce((a, b) => a + b, 0)}`).join(", ");
console.log(`check-pages: ${pages.length} pages follow the page rules${left ? ` (known problems left: ${left})` : ""}${BUILT ? "" : "; links checked by build:relay"}.`);
