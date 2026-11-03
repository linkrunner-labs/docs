import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { HeadConfig, TransformContext } from "vitepress";
import { relaySidebars } from "./relay-nav";
import { findGroup, pagePath, plainText } from "./theme-relay/page-path";

/**
 * Share previews for the Relay build (docs.v2). Every page gets Open Graph and
 * Twitter tags plus its own 1200x630 card, drawn at build time in Relay
 * styling: logo, the page's sidebar group, title and description. Static PNGs
 * need nothing running at request time.
 */
import { MAIN_SITE, SITE_URL } from "./site";

export { SITE_URL };
const W = 1200;
const H = 630;

// Relay tokens (theme-relay/tokens.css).
const C = {
  bg: "#ffffff",
  surface: "#f9f9fb", // gray-solid-50
  border: "#e8e8ed", // gray-solid-100
  text: "#303037", // text-primary, gray-solid-700
  secondary: "#5d5d64", // gray-solid-500
  muted: "#8f8f96", // gray-solid-400
  accent: "#4d4bf7", // interactive-surface-default, blue-500
};

type Card = { file: string; title: string; description: string; group: string };
const cards = new Map<string, Card>();

const sidebars = Object.values(relaySidebars) as Parameters<typeof findGroup>[0][];

function groupFor(path: string): string {
  for (const s of sidebars) {
    const g = findGroup(s, path);
    if (g?.text) return plainText(g.text);
  }
  return "Documentation";
}

/** VitePress transformHead: adds the tags and queues the page's card. */
export function ogHead({ pageData, title, description, siteData }: TransformContext): HeadConfig[] {
  if (pageData.isNotFound || pageData.relativePath === "404.md") return [];
  const path = pagePath(pageData.relativePath);
  const file = `og/${path === "/" ? "index" : path.slice(1)}.png`;
  const desc = pageData.description || description || siteData.description;
  const pageTitle = pageData.title || siteData.title;
  cards.set(file, { file, title: pageTitle, description: desc, group: groupFor(path) });

  const url = SITE_URL + (path === "/" ? "/" : path);
  const image = `${SITE_URL}/${file}`;
  const alt = `${pageTitle}: Linkrunner documentation`;
  return [
    // The main site names itself as the page's address; the preview is noindex.
    ...(MAIN_SITE ? ([["link", { rel: "canonical", href: url }]] as HeadConfig[]) : []),
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Linkrunner Docs" }],
    ["meta", { property: "og:title", content: title }],
    ["meta", { property: "og:description", content: desc }],
    ["meta", { property: "og:url", content: url }],
    ["meta", { property: "og:image", content: image }],
    ["meta", { property: "og:image:width", content: String(W) }],
    ["meta", { property: "og:image:height", content: String(H) }],
    ["meta", { property: "og:image:alt", content: alt }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@Linkrunner_io" }],
    ["meta", { name: "twitter:title", content: title }],
    ["meta", { name: "twitter:description", content: desc }],
    ["meta", { name: "twitter:image", content: image }],
    ["meta", { name: "twitter:image:alt", content: alt }],
  ];
}

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFileSync(join(dirname(require.resolve(`${pkg}/package.json`)), "files", file));

// Minimal element helper for satori (it takes React-like objects).
const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style, children },
});

function card({ title, description, group }: Card, logo: string) {
  return el(
    "div",
    {
      width: W,
      height: H,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px 56px",
      background: C.bg,
      borderBottom: `10px solid ${C.accent}`,
      fontFamily: "Inter",
    },
    [
      el("div", { display: "flex", alignItems: "center" }, [
        { type: "img", props: { src: logo, height: 40, width: 276 } },
        el("div", { marginLeft: 22, fontSize: 40, fontWeight: 400, color: C.border }, "/"),
        el("div", { marginLeft: 18, fontSize: 34, fontWeight: 500, color: C.text }, "Docs"),
      ]),
      el("div", { display: "flex", flexDirection: "column" }, [
        el("div", { display: "flex", alignItems: "center", marginBottom: 22 }, [
          el("div", { width: 14, height: 14, background: C.accent, marginRight: 14 }),
          el(
            "div",
            { fontFamily: "DM Mono", fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: C.secondary },
            group,
          ),
        ]),
        el(
          "div",
          { fontSize: title.length > 40 ? 60 : 72, fontWeight: 600, letterSpacing: -2, lineHeight: 1.1, color: C.text, lineClamp: 2, display: "block" },
          title,
        ),
        description
          ? el(
              "div",
              { marginTop: 22, fontSize: 30, lineHeight: 1.4, color: C.secondary, lineClamp: 2, display: "block", maxWidth: 980 },
              description,
            )
          : el("div", {}),
      ]),
      el("div", { display: "flex", justifyContent: "space-between", fontFamily: "DM Mono", fontSize: 20, color: C.muted }, [
        el("div", {}, new URL(SITE_URL).host),
        el("div", {}, "Mobile attribution and marketing analytics"),
      ]),
    ],
  );
}

/** VitePress buildEnd: draws every queued card into <outDir>/og/. */
export async function renderOgImages(outDir: string) {
  // Loaded here, not at the top: the bundled config hoists top-level package
  // imports, and docs.backup shouldn't load the native renderer.
  const { default: satori } = await import("satori");
  const { Resvg } = await import("@resvg/resvg-js");
  const fonts = [
    { name: "Inter", data: font("@fontsource/inter", "inter-latin-400-normal.woff"), weight: 400 as const },
    { name: "Inter", data: font("@fontsource/inter", "inter-latin-500-normal.woff"), weight: 500 as const },
    { name: "Inter", data: font("@fontsource/inter", "inter-latin-600-normal.woff"), weight: 600 as const },
    { name: "DM Mono", data: font("@fontsource/dm-mono", "dm-mono-latin-400-normal.woff"), weight: 400 as const },
  ];
  const logoSvg = readFileSync(fileURLToPath(new URL("../public/logo/light.svg", import.meta.url)));
  const logo = `data:image/svg+xml;base64,${logoSvg.toString("base64")}`;

  for (const c of cards.values()) {
    const svg = await satori(card(c, logo) as unknown as Parameters<typeof satori>[0], { width: W, height: H, fonts });
    const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
    const out = join(outDir, c.file);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, png);
  }
  console.log(`og: wrote ${cards.size} share images`);
}
