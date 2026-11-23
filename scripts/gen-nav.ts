/**
 * Build the VitePress sidebar + nav from Mintlify's docs.json navigation tree.
 * Each Mintlify tab becomes a top-nav item plus its own sidebar. Sidebars are
 * keyed by folder (`/sdk/`), with page-level keys (`/features/mcp.md`) for the
 * few pages whose tab differs from the rest of their folder. See
 * .vitepress/theme/sidebar.ts for how the keys are expanded.
 * Reads page titles + icons from the source Mintlify .mdx frontmatter and bakes
 * a small icon (inline Font Awesome SVG, or an <img> for brand logos) into each
 * sidebar label, the same way Mintlify shows an icon next to every page.
 * Writes nav.json, which .vitepress/config.ts imports.
 *
 * Run after convert.ts: bun run scripts/gen-nav.ts
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import faSolid from "@iconify-json/fa6-solid/icons.json";
import faBrands from "@iconify-json/fa6-brands/icons.json";
import { getIconData, iconToSVG } from "@iconify/utils";

const SRC_DIR = resolve(process.env.MINTLIFY_SRC || "../docs");
const SRC_DOCS_JSON = join(SRC_DIR, "docs.json");
const OUT = resolve(process.env.DOCS_V2_OUT || ".");

// `icon` keeps the raw Mintlify icon name so the Relay build can draw its own
// (Phosphor) glyph instead of the baked-in Font Awesome one.
type SidebarItem = { text: string; link?: string; icon?: string; items?: SidebarItem[]; collapsed?: boolean };

// ---- Icon resolution (mirrors .vitepress/theme/components/Icon.vue) --------
// Mintlify uses Font Awesome names; brand glyphs live in fa6-brands, the rest in
// fa6-solid. Resolved to raw SVG at build time so they render via v-html in the
// sidebar (Vue components can't run inside a v-html label).
const BRANDS = new Set([
  "apple", "android", "react", "flutter", "unity", "google", "meta", "facebook",
  "instagram", "tiktok", "snapchat", "linkedin", "linkedin-in", "github", "x-twitter",
  "twitter", "node-js", "npm", "js", "java", "swift", "python", "php", "vuejs",
  "angular", "aws", "google-play", "app-store-ios", "shopify", "stripe", "slack",
]);

// Map Font Awesome Pro names to their free-set equivalents.
const ALIAS: Record<string, string> = {
  "circle-dollar": "sack-dollar",
  "chart-mixed": "chart-line",
  "chart-line-down": "chart-line",
  "mobile-screen": "mobile-screen-button",
  "hand-pointer": "arrow-pointer",
  "link-simple": "link",
  // Not in the free set; substitute close free equivalents.
  "sparkles": "wand-magic-sparkles",
  "webhook": "plug",
  "list-timeline": "list",
  "shield-check": "shield-halved",
  "shopping-bag": "bag-shopping",
};

function isImagePath(name: string): boolean {
  return /^(\/|https?:)/.test(name) || /\.(svg|png|webp|jpe?g)$/i.test(name);
}

function iconHtml(name?: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  if (isImagePath(trimmed)) {
    return `<span class="sidebar-icon"><img class="sidebar-icon-img" src="${trimmed}" alt=""></span>`;
  }
  let n = trimmed.replace(/^fa[a-z]?-/, "");
  n = ALIAS[n] || n;
  const collection = (BRANDS.has(n) ? faBrands : faSolid) as any;
  const data = getIconData(collection, n);
  if (!data) return "";
  const r = iconToSVG(data);
  return `<span class="sidebar-icon"><svg viewBox="${r.attributes.viewBox}" width="1em" height="1em" fill="currentColor" aria-hidden="true">${r.body}</svg></span>`;
}

// ---- Read title + icon from the source .mdx frontmatter --------------------
function frontmatterOf(page: string): Record<string, any> {
  const file = join(SRC_DIR, page + ".mdx");
  if (existsSync(file)) {
    const src = readFileSync(file, "utf8");
    const m = src.match(/^---\n([\s\S]*?)\n---/);
    if (m) {
      try {
        return parseYaml(m[1]) || {};
      } catch {
        /* fall through */
      }
    }
  }
  return {};
}

function titleOf(page: string): string {
  // Mintlify labels the sidebar with sidebarTitle when a page sets one.
  const sidebarTitle = frontmatterOf(page).sidebarTitle;
  if (sidebarTitle) return String(sidebarTitle);
  // Prefer the converted page's title; fall back to source, then humanized slug.
  const converted = join(OUT, page + ".md");
  for (const file of [converted, join(SRC_DIR, page + ".mdx")]) {
    if (existsSync(file)) {
      const src = readFileSync(file, "utf8");
      const m = src.match(/^---\n([\s\S]*?)\n---/);
      if (m) {
        try {
          const fm = parseYaml(m[1]) || {};
          if (fm.title) return String(fm.title);
        } catch {
          /* fall through */
        }
      }
    }
  }
  const seg = page.split("/").pop() || page;
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildItems(pages: any[], depth: number): SidebarItem[] {
  return pages.map((p) => {
    if (typeof p === "string") {
      const icon = frontmatterOf(p).icon as string | undefined;
      return { text: iconHtml(icon) + titleOf(p), link: "/" + p, ...(icon ? { icon } : {}) };
    }
    // Nested group: { group, icon?, pages }
    return {
      text: iconHtml(p.icon) + p.group,
      ...(p.icon ? { icon: p.icon } : {}),
      collapsed: true,
      items: buildItems(p.pages, depth + 1),
    };
  });
}

const docsJson = JSON.parse(readFileSync(SRC_DOCS_JSON, "utf8"));
const tabs: any[] = docsJson.navigation.tabs;

const pagesOf = (items: any[]): string[] =>
  items.flatMap((p) => (typeof p === "string" ? [p] : pagesOf(p.pages)));

// Top-level groups stay icon-free (matches Mintlify); leaf pages + nested
// sub-groups carry icons.
const tabData = tabs.map((t) => {
  const pages = t.groups.flatMap((g: any) => pagesOf(g.pages));
  const sidebar: SidebarItem[] = t.groups.map((g: any) => ({
    text: g.group,
    collapsed: false,
    items: buildItems(g.pages, 1),
  }));
  return { name: t.tab as string, pages, sidebar };
});

// Folder -> tab: the tab holding most of the folder's pages. Root pages
// (introduction, quickstart) are keyed individually.
const folderOf = (p: string) => (p.includes("/") ? p.slice(0, p.lastIndexOf("/") + 1) : null);
const votes = new Map<string, Map<number, number>>();
tabData.forEach((t, i) => {
  for (const p of t.pages) {
    const f = folderOf(p);
    if (!f) continue;
    const v = votes.get(f) ?? new Map<number, number>();
    v.set(i, (v.get(i) ?? 0) + 1);
    votes.set(f, v);
  }
});
const folderTab = new Map<string, number>();
for (const [f, v] of votes) folderTab.set(f, [...v].sort((a, b) => b[1] - a[1])[0][0]);

// VitePress picks the key with the most path segments that prefixes the page
// path (stable sort on ties), so page keys go first and win over their folder.
const pageKeys: [string, number][] = [];
tabData.forEach((t, i) => {
  for (const p of t.pages) {
    const f = folderOf(p);
    if (!f || folderTab.get(f) !== i) pageKeys.push([`/${p}.md`, i]);
  }
});
// Store each tab's sidebar once plus a key -> tab index map; the theme expands
// it at startup (.vitepress/theme/sidebar.ts). Writing the expanded map here
// would copy a full sidebar per key into the site data inlined in every page.
const sidebarKeys: Record<string, number> = {};
for (const [k, i] of pageKeys) sidebarKeys[k] = i;
for (const [f, i] of [...folderTab].sort((a, b) => b[0].length - a[0].length)) {
  sidebarKeys[`/${f}`] = i;
}
const sidebars = tabData.map((t) => t.sidebar);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const nav = [
  ...tabData.map((t) => ({
    text: t.name,
    link: "/" + t.pages[0],
    // Highlight the tab on every page it owns (path has no .md extension).
    activeMatch: `^/(${t.pages.map(escapeRe).join("|")})$`,
  })),
  // No manual arrow: VitePress adds its own external-link icon for https links.
  { text: "Dashboard", link: "https://dashboard.linkrunner.io" },
  { text: "Support", link: "mailto:support@linkrunner.io" },
];

writeFileSync(
  join(OUT, ".vitepress/nav.json"),
  // docs.json `markdown.instructions`: the agent instructions Mintlify puts at
  // the top of llms.txt. The Relay build does the same (agent-files.ts).
  JSON.stringify({ nav, sidebars, sidebarKeys, agentInstructions: docsJson.markdown?.instructions ?? [] }, null, 2)
);

console.log(
  `Generated nav.json: ${tabData.length} tabs, ${tabData.reduce((n, t) => n + t.pages.length, 0)} pages, ` +
    `${Object.keys(sidebarKeys).length} sidebar keys (${pageKeys.length} page-level).`
);
