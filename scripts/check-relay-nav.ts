/**
 * Fail if the Relay sidebars drop a page that the classic sidebars link to,
 * link to a page that doesn't exist, or name a sidebar icon the Relay theme
 * can't draw. Run before the Relay build.
 *
 * Run: bun run scripts/check-relay-nav.ts
 */
import { existsSync } from "node:fs";
import nav from "../.vitepress/nav.json";
import { relaySidebars, sidebarIconHtml } from "../.vitepress/relay-nav";
import { RELAY_REDIRECTS } from "../.vitepress/relay-content";

type Item = { link?: string; icon?: string; items?: Item[] };

function links(items: Item[], out = new Set<string>()): Set<string> {
  for (const it of items) {
    if (it.link) out.add(it.link.replace(/\/$/, "") || "/");
    if (it.items) links(it.items, out);
  }
  return out;
}

const classic = links((nav.sidebars as Item[][]).flat());
const relay = links(relaySidebars.flat() as Item[]);

// Pages merged into another page are fine as long as their target is listed.
const target = (l: string) => (RELAY_REDIRECTS[l] ?? l).replace(/#.*$/, "");
const missing = [...classic].filter((l) => !relay.has(target(l)));
const unlistedRedirects = Object.values(RELAY_REDIRECTS).map(target).filter((l) => !relay.has(l));
const broken = [...relay].filter((l) => {
  if (/^https?:|^mailto:/.test(l)) return false;
  if (l === "/") return !existsSync("relay-pages/index.md");
  return !existsSync(`.${l}.md`) && !existsSync(`.${l}/index.md`) && !existsSync(`relay-pages${l}.md`);
});

// A name with no Phosphor mapping (theme-relay/icon-map.ts) would silently
// drop the icon from the sidebar.
const unknownIcons = new Set<string>();
const checkIcons = (items: Item[]) => {
  for (const it of items) {
    if (it.link && it.icon && !sidebarIconHtml(it.icon)) unknownIcons.add(it.icon);
    if (it.items) checkIcons(it.items);
  }
};
checkIcons((nav.sidebars as Item[][]).flat());

if (unlistedRedirects.length) {
  console.error(`Merged pages redirect to ${unlistedRedirects.length} page(s) the Relay sidebar doesn't list:\n  ${unlistedRedirects.join("\n  ")}`);
  process.exit(1);
}
if (missing.length || broken.length || unknownIcons.size) {
  if (unknownIcons.size)
    console.error(`No Relay icon for ${unknownIcons.size} sidebar icon name(s), add them to theme-relay/icon-map.ts:\n  ${[...unknownIcons].join("\n  ")}`);
  if (missing.length) console.error(`Relay sidebar is missing ${missing.length} page(s):\n  ${missing.join("\n  ")}`);
  if (broken.length) console.error(`Relay sidebar links to ${broken.length} missing page(s):\n  ${broken.join("\n  ")}`);
  process.exit(1);
}
console.log(
  `Relay sidebar covers all ${classic.size} classic sidebar pages (${relay.size} links, ${Object.keys(RELAY_REDIRECTS).length} merged pages redirect).`
);
