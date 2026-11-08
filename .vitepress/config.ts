import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type DefaultTheme, type HeadConfig, type UserConfig } from "vitepress";
import nav from "./nav.json";
import { RELAY_PAGES, RELAY_REMOVED, PAGE_TITLES } from "./relay-content";
import { legacyAnchors } from "./legacy-anchors";

/**
 * Two builds share this content:
 * - classic (default): docs.backup.linkrunner.io on GitHub Pages.
 * - relay (DOCS_THEME=relay): docs.v2.linkrunner.io on Firebase Hosting, using
 *   the Relay design system. Relay-only pages live in relay-pages/ and replace
 *   their routes only in this build.
 */
const RELAY = process.env.DOCS_THEME === "relay";

const themeDir = fileURLToPath(
  new URL(RELAY ? "./theme-relay/index.ts" : "./theme/classic.ts", import.meta.url)
);

// Contributor files (agent policy and skills) are not docs pages.
const CONTRIBUTOR_FILES = ["AGENTS.md", "CLAUDE.md", "skills/**", ".agents/**", ".claude/**"];

const shared: UserConfig<DefaultTheme.Config> = {
  title: "Linkrunner",
  description: "Linkrunner documentation: mobile attribution and marketing analytics",
  lang: "en-US",
  cleanUrls: true,
  lastUpdated: true,
  // Internal links are audited separately; don't fail the build on them.
  ignoreDeadLinks: true,
  vite: {
    resolve: { alias: { "@docs-variant": themeDir } },
  },
  markdown: {
    languageAlias: { gradle: "groovy" },
    // Mintlify content embeds {{macro}} syntax (e.g. Meta URL macros) in inline
    // code. Mark inline code v-pre so Vue doesn't try to interpolate it.
    config(md) {
      // Heading, tab and accordion ids match docs.linkrunner.io (Mintlify).
      legacyAnchors(md);
      const inline = md.renderer.rules.code_inline!;
      md.renderer.rules.code_inline = (tokens, idx, opts, env, self) => {
        tokens[idx].attrSet("v-pre", "");
        return inline(tokens, idx, opts, env, self);
      };
    },
  },
};

const classic: UserConfig<DefaultTheme.Config> = {
  ...shared,
  // Default to the dark theme (matches the public docs); toggle still works.
  appearance: "dark",
  srcExclude: ["README.md", "**/README.md", ...CONTRIBUTOR_FILES, "relay-pages/**"],
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#7a77ff" }],
    // Backup copy of docs.linkrunner.io: keep duplicate content out of search
    // engines (LIN-3649). GitHub Pages cannot send X-Robots-Tag.
    ["meta", { name: "robots", content: "noindex, nofollow" }],
  ],
  themeConfig: {
    logo: { light: "/logo/light.svg", dark: "/logo/dark.svg" },
    siteTitle: false,
    search: { provider: "local" },
    nav: nav.nav,
    // Sidebars are attached in the theme (see theme/sidebar.ts) to keep them
    // out of the per-page site data.
    outline: { level: [2, 3] },
    footer: {
      message: "Need help? Contact support@linkrunner.io",
      copyright: "© Linkrunner",
    },
  },
};

// Relay-only modules load only for the Relay build, so docs.backup never
// depends on the Relay sidebar map or the share-image renderer (native resvg).
async function relayConfig(): Promise<UserConfig<DefaultTheme.Config>> {
  const { relayNav } = await import("./relay-nav");
  const { rewrite, routeOf } = await import("./relay-markdown");
  const { writeAgentMarkdown } = await import("./agent-markdown");
  const { ogHead, renderOgImages, SITE_URL } = await import("./og");
  const { MAIN_SITE } = await import("./site");
  const { agentHead, writeAgentFiles } = await import("./agent-files");
  return {
    ...shared,
    // The desktop top bar is two rows (112px), so anchor jumps land below it.
    scrollOffset: 160,
    vite: {
      resolve: {
        alias: [
          { find: "@docs-variant", replacement: themeDir },
          // Cards and accordions import "./Icon.vue" (Font Awesome); Relay
          // draws the same names with Phosphor.
          {
            find: /^\.\/Icon\.vue$/,
            replacement: fileURLToPath(new URL("./theme-relay/components/RelayIcon.vue", import.meta.url)),
          },
        ],
      },
    },
    markdown: {
      ...shared.markdown,
      config(md) {
        shared.markdown!.config!(md);
        // Relay-only titles, "Before you start" boxes and SDK checklists
        // (relay-markdown.ts). Search indexes the same rewritten source.
        const parse = md.parse.bind(md);
        md.parse = (src, env) => parse(env?.relativePath ? rewrite(src, env.relativePath) : src, env);
        // Headings written as `## Title {#id .class}` would otherwise read that
        // attribute syntax aloud in the permalink's label.
        md.core.ruler.push("lr-anchor-label", (state) => {
          for (const t of state.tokens) {
            for (const c of t.children ?? []) {
              if (c.type !== "link_open" || c.attrGet("class") !== "header-anchor") continue;
              const label = c.attrGet("aria-label");
              if (label) c.attrSet("aria-label", label.replace(/\s*\{[^}]*\}"$/, '"'));
            }
          }
        });
      },
      // The default GitHub themes fall just under 4.5:1 on Relay's code
      // surfaces; the high-contrast variants pass in both modes.
      theme: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
    },
    outDir: ".vitepress/dist-relay",
    cacheDir: ".vitepress/cache-relay",
    // Share previews: per-page Open Graph / Twitter tags and cards (og.ts),
    // and a link to the page's Markdown copy for agents (agent-files.ts).
    transformHead: (ctx) => [...ogHead(ctx), ...agentHead(ctx)],
    sitemap: { hostname: SITE_URL },
    transformPageData(pageData) {
      const route = routeOf(pageData.relativePath);
      const title = PAGE_TITLES[route]?.title;
      if (title) {
        pageData.title = title;
        pageData.frontmatter.title = title;
      }
      // Long guides list only their main sections under "On this page".
      if (pageData.frontmatter.outline === undefined && countHeadings(pageData.filePath) > 28) {
        pageData.frontmatter.outline = [2, 2];
      }
    },
    buildEnd: async (site) => {
      await renderOgImages(site.outDir);
      // Markdown copy of every page for the "Copy page" button and agents.
      const pages = writeAgentMarkdown(site);
      console.log(`agent markdown: wrote ${pages.size} pages`);
      // llms.txt, llms-full.txt, skill.md, robots.txt (agent-files.ts).
      console.log(`agent files: wrote ${writeAgentFiles(site, pages).join(", ")}`);
    },
    // Relay is a light-first system; the toggle still offers dark.
    // VitePress spreads this into useDark(), so "light" works at runtime; its
    // type only lists "dark".
    appearance: { initialValue: "light" } as unknown as UserConfig["appearance"],
    srcExclude: ["README.md", "**/README.md", ...CONTRIBUTOR_FILES, ...RELAY_PAGES, ...RELAY_REMOVED],
    rewrites: Object.fromEntries(RELAY_PAGES.map((p) => [`relay-pages/${p}`, p])),
    head: [
      ["link", { rel: "icon", href: "/favicon.svg" }],
      ["meta", { name: "theme-color", content: "#4d4bf7" }],
      // The docs.v2 preview stays out of search engines (site.ts MAIN_SITE);
      // firebase.json also sends X-Robots-Tag until the switch.
      ...(MAIN_SITE ? [] : ([["meta", { name: "robots", content: "noindex, nofollow" }]] as HeadConfig[])),
    ],
    themeConfig: {
      logo: { light: "/logo/light.svg", dark: "/logo/dark.svg", alt: "Linkrunner" },
      siteTitle: false,
      nav: relayNav,
      outline: { level: [2, 3], label: "On this page" },
      docFooter: { prev: "Previous", next: "Next" },
      returnToTopLabel: "Back to top",
      sidebarMenuLabel: "Menu",
      darkModeSwitchLabel: "Appearance",
      lastUpdated: { text: "Last updated", formatOptions: { dateStyle: "long" } },
      search: {
        provider: "local",
        options: {
          translations: {
            button: { buttonText: "Search documentation", buttonAriaLabel: "Search documentation" },
            modal: {
              displayDetails: "Show details",
              resetButtonTitle: "Clear search",
              backButtonTitle: "Close search",
              noResultsText: "No results for",
              footer: {
                selectText: "to open",
                navigateText: "to move",
                closeText: "to close",
              },
            },
          },
        },
      },
    },
  };
}

function countHeadings(filePath: string): number {
  try {
    const src = readFileSync(fileURLToPath(new URL(`../${filePath}`, import.meta.url)), "utf8");
    return (src.match(/^#{2,3} /gm) ?? []).length;
  } catch {
    return 0;
  }
}

export default defineConfig(RELAY ? await relayConfig() : classic);
