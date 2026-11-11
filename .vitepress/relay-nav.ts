/**
 * Navigation for the Relay build (docs.v2.linkrunner.io).
 *
 * Built from the generated nav.json so every page stays reachable, then:
 * - swaps the baked-in Font Awesome sidebar icons for Relay's Phosphor ones (or
 *   the brand logo) on page links; group headings stay text only,
 * - splits the docs by reader: Guides (marketers) and Setup (SDKs,
 *   testing, APIs), so neither sidebar lists the other's pages,
 * - uses the plainer titles and short labels from relay-content.ts and drops
 *   pages merged into another page (RELAY_REDIRECTS),
 * - collapses every group except the one holding the current page.
 *
 * scripts/check-relay-nav.ts fails the build if a page linked from the classic
 * sidebar is missing here (unless it redirects to a merged page).
 */
import type { DefaultTheme } from "vitepress";
import nav from "./nav.json";
import { iconSvg, isIconPath } from "./theme-relay/resolve-icon";
import { PAGE_TITLES, RELAY_REDIRECTS } from "./relay-content";

type Item = DefaultTheme.SidebarItem & { icon?: string };
type Group = { text: string; items: Item[]; collapsed?: boolean };

const ICON_RE = /<span class="sidebar-icon[^"]*">[\s\S]*?<\/span>\s*/g;

/** Label HTML for a sidebar icon, or "" when the name doesn't resolve. */
export function sidebarIconHtml(name: string): string {
  if (isIconPath(name)) return `<span class="sidebar-icon"><img class="sidebar-icon-img" src="${name}" alt=""></span>`;
  const svg = iconSvg(name);
  if (!svg) return "";
  return `<span class="sidebar-icon"><svg viewBox="${svg.viewBox}" width="1em" height="1em" aria-hidden="true">${svg.body}</svg></span>`;
}

// The label is rendered as HTML, so the icon rides along in it. Previous/next
// links reuse the label, so they get the page title as plain text instead.
function page(text: string, link: string, icon?: string): Item {
  const t = PAGE_TITLES[link];
  const label = t?.label ?? t?.title ?? text;
  const footer = t?.title ?? text;
  return icon ? { text: sidebarIconHtml(icon) + label, docFooterText: footer, link } : { text: label, docFooterText: footer, link };
}

// Every page from nav.json, by link, with its label and icon.
const classic = new Map<string, Item>();
const index = (items: Item[]) => {
  for (const it of items) {
    if (it.link) classic.set(it.link, it);
    if (it.items) index(it.items as Item[]);
  }
};
(nav.sidebars as Group[][]).flat().forEach((g) => index(g.items));

/** Sidebar link for a classic page (throws if nav.json doesn't have it). */
function p(link: string, icon?: string): Item {
  const it = classic.get(link);
  if (!it) throw new Error(`relay-nav: no page "${link}" in nav.json`);
  return page((it.text || "").replace(ICON_RE, "").trim(), link, icon ?? it.icon);
}

const links = (...l: string[]) => l.map((x) => p(x));

/** Every page of a classic sidebar group, in order, minus merged pages. */
function classicGroup(tab: number, name: string): Item[] {
  const g = (nav.sidebars as Group[][])[tab].find((x) => x.text.replace(ICON_RE, "").trim() === name);
  if (!g) throw new Error(`relay-nav: no sidebar group "${name}" in tab ${tab}`);
  const out: Item[] = [];
  const walk = (items: Item[]) => {
    for (const it of items) {
      if (it.link && !RELAY_REDIRECTS[it.link]) out.push(p(it.link));
      if (it.items) walk(it.items as Item[]);
    }
  };
  walk(g.items);
  return out;
}

// Group headings toggle; VitePress opens the group holding the current page.
// The heading's icon rides in its label like a page link's; breadcrumbs and
// share images use the plain text (page-path.ts plainText).
const group = (text: string, items: Item[], open: boolean, icon: string): Group => ({
  text: sidebarIconHtml(icon) + text,
  items,
  collapsed: !open,
});
// A nested group (Meta, Google) shows its first page's logo.
const sub = (text: string, items: Item[]): Item => {
  const icon = classic.get(items[0].link!)?.icon;
  return { text: (icon ? sidebarIconHtml(icon) : "") + text, items, collapsed: true };
};

const guides: Group[] = [
  group("Start here", [page("Overview", "/", "compass"), page("Sign in and add teammates", "/features/add-teammates", "users")], true, "flag"),
  group(
    "Deep links",
    links(
      "/features/create-trackable-link",
      "/features/deferred-deep-linking",
      "/features/deep-link-management",
      "/features/link-redirection",
      "/features/deactivate-campaign-link",
      "/features/referral-codes",
      "/features/custom-store-listing",
      "/features/social-media-intermediary-page",
      "/features/custom-landing-page",
      "/features/push-notification-tracking",
      "/features/push-notification-providers"
    ),
    false,
    "link-simple"
  ),
  group(
    "Web attribution",
    links(
      "/features/web-events-tracking",
      "/features/web-campaign-link",
      "/features/web-partner-link",
      "/features/web-campaigns-report",
      "/features/web-creatives",
      "/features/meta-web-conversions",
      "/features/google-ads-web-conversions",
      "/features/web-to-app-journeys"
    ),
    false,
    "globe"
  ),
  group("Users and events", links("/features/users-tab", "/features/events-tab", "/features/retention", "/features/data-export"), false, "users-three"),
  group(
    "Measurement",
    [
      page("What the Campaigns columns mean", "/features/campaign-metrics", "chart-bar"),
      ...links(
      "/features/attribution-windows",
      "/features/ctv-attribution",
      "/features/fraud-control",
      "/features/uninstall-tracking",
      "/features/send-consent",
      "/features/meta-install-referrer"
      ),
    ],
    false,
    "chart-line"
  ),
  group("iOS and SKAN", [
    p("/features/ios-campaign-data-limitations"),
    p("/features/skadnetwork-integration"),
    p("/features/google-skan-setup"),
    p("/features/meta-skan-setup"),
    p("/features/skadnetwork-conversion-values"),
    page("Read the SKAN dashboard", "/features/skan-dashboard/overview", classic.get("/features/skan-dashboard/overview")?.icon),
  ], false, "apple-logo"),
  group("Remarketing", [
    page("Run remarketing campaigns", "/features/remarketing", classic.get("/features/remarketing-guide")?.icon),
    page("Build an audience", "/features/remarketing-audiences", classic.get("/features/remarketing-audience-segments")?.icon),
  ], false, "arrows-clockwise"),
  group("Billing", links("/billing/overview", "/billing/wallet", "/billing/finance-role"), false, "credit-card"),
  group("Troubleshooting", links("/testing/testing-attribution-troubleshooting"), false, "lifebuoy"),
];

// Setup: for whoever wires Linkrunner into the app (SDKs, deep link
// verification, testing, APIs).
const setup: Group[] = [
  group(
    "Start here",
    [
      p("/quickstart"),
      p("/features/mcp"),
      page("Approve AI changes", "/features/mcp-changes", "shield-check"),
      page("AI change tool reference", "/features/mcp-tools", "list-check"),
      p("/features/website-projects"),
      p("/ai-agent-skills"),
    ],
    true,
    "flag",
  ),
  group(
    "SDKs",
    links(
      "/sdk/react-native",
      "/sdk/flutter",
      "/sdk/ios",
      "/sdk/android",
      "/sdk/expo",
      "/sdk/capacitor",
      "/sdk/cordova",
      "/sdk/unity",
      "/sdk/web",
      "/sdk/shopify",
      "/sdk/appbrew",
      "/sdk/track-payments",
      "/sdk/migrate-to-track-event"
    ),
    false,
    "code"
  ),
  // The link domain and the app-side deep link setup; the marketer guides for
  // links stay under Guides → Deep links.
  group("Deep links", links("/features/subdomain-setup", "/features/deep-linking-setup"), false, "link-simple"),
  group(
    "Test your setup",
    links("/testing/integration-testing", "/testing/event-and-revenue-testing", "/testing/web-sdk-testing", "/testing/meta-android-attribution-testing"),
    false,
    "flask"
  ),
  group("APIs", classicGroup(2, "API Reference"), false, "plugs-connected"),
  group("Webhooks", links("/features/webhooks"), false, "webhooks-logo"),
];

const integrations: Group[] = [
  group("Ad channels", [
    page("All ad channels", "/ad-networks/overview", "list"),
    sub("Meta", links("/ad-networks/meta-ads", "/ad-networks/meta-web-to-app", "/ad-networks/meta-ads-discrepancies", "/ad-networks/meta-view-through-attribution", "/ad-networks/meta-support-access")),
    sub("Google", links("/ad-networks/google-ads", "/features/google-icm", "/ad-networks/google-ads-discrepancies", "/ad-networks/google-support-access")),
    ...links("/ad-networks/tiktok", "/ad-networks/snapchat", "/ad-networks/reddit-ads", "/ad-networks/linkedin-ads", "/ad-networks/chatgpt-ads", "/ad-networks/sharechat-ads", "/ad-networks/x-ads"),
  ], true, "megaphone"),
  group("Analytics tools", classicGroup(1, "Analytics Integrations"), true, "chart-bar"),
  group("Product catalogues", classicGroup(1, "Ecommerce Manager"), true, "shopping-cart"),
];

const PARTNER_ICONS: Record<string, string> = {
  "Affiliate Partners": "handshake",
  "Affiliate APIs": "code",
  "Affiliate Platforms": "plugs",
  "Agency Partners": "briefcase",
};
const partners: Group[] = (nav.sidebars as Group[][])[3].map((g) => {
  const name = g.text.replace(ICON_RE, "").trim();
  return group(name, classicGroup(3, name), true, PARTNER_ICONS[name] ?? "handshake");
});

export const relaySidebars: Group[][] = [guides, setup, integrations, partners];

const allLinks = (tab: Group[]) => {
  const out: string[] = [];
  const walk = (items: Item[]) => items.forEach((it) => (it.link && out.push(it.link), it.items && walk(it.items as Item[])));
  tab.forEach((g) => walk(g.items));
  return out;
};

/**
 * One key per page, pointing at the tab whose sidebar lists it. VitePress
 * tries keys with the same depth in insertion order, so page keys go first,
 * then a folder fallback (the tab most of that folder's pages are in) for any
 * page that isn't in a sidebar.
 */
export const relaySidebarKeys: Record<string, number> = {};
relaySidebars.forEach((tab, i) => {
  for (const l of allLinks(tab)) relaySidebarKeys[l === "/" ? "/index.md" : `${l}.md`] ??= i;
});
for (const dir of Object.keys(nav.sidebarKeys).filter((k) => k.endsWith("/"))) {
  const tabs = Object.entries(relaySidebarKeys).filter(([k]) => k.startsWith(dir)).map(([, t]) => t);
  if (!tabs.length) continue;
  const counts = tabs.reduce((m, t) => m.set(t, (m.get(t) ?? 0) + 1), new Map<number, number>());
  relaySidebarKeys[dir] = [...counts].sort((a, b) => b[1] - a[1])[0][0];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const activeMatch = (tab: number) => {
  const pages = Object.entries(relaySidebarKeys)
    .filter(([k, t]) => t === tab && k.endsWith(".md"))
    .map(([k]) => escape(k.replace(/^\//, "").replace(/(^|\/)?index\.md$/, "").replace(/\.md$/, "")));
  return `^/(${pages.join("|")})$`;
};

export const relayNav: DefaultTheme.NavItem[] = [
  { text: "Guides", link: "/", activeMatch: activeMatch(0) },
  { text: "Setup", link: "/quickstart", activeMatch: activeMatch(1) },
  { text: "Integrations", link: "/ad-networks/overview", activeMatch: activeMatch(2) },
  { text: "Partners", link: "/affiliate-partners/getting-started", activeMatch: activeMatch(3) },
  { text: "Dashboard", link: "https://dashboard.linkrunner.io" },
];
