/**
 * Files for AI agents on the Relay build (docs.v2), the same set Mintlify
 * serves on docs.linkrunner.io, so agents and crawlers keep working after the
 * cutover:
 * - /llms.txt (and /.well-known/llms.txt): every page with its description,
 *   grouped by sidebar section, linking each page's Markdown copy, after the
 *   agent instructions from docs.json (`markdown.instructions`, via nav.json).
 * - /llms-full.txt: every page's Markdown in one file. The Linkrunner MCP
 *   `search_documentation` tool parses it (`# Title` then `Source: <url>`), so
 *   keep that header shape. scripts/check-agent-files.ts checks it.
 * - /skill.md (and /.well-known/skills/): a short skill that tells an agent
 *   how to read these docs, connect the MCP server and install the SDK skills.
 * - /robots.txt: crawling and AI use allowed, with the sitemap.
 * Each page's HTML also links its Markdown copy (rel="alternate").
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { DefaultTheme, HeadConfig, SiteConfig, TransformContext } from "vitepress";
import nav from "./nav.json";
import { markdownPath } from "./agent-markdown";
import { SITE_URL } from "./og";
import { relayNav, relaySidebars } from "./relay-nav";
import { pagePath, plainText } from "./theme-relay/page-path";

type Meta = { title: string; description: string };
const meta = new Map<string, Meta>();

const INSTRUCTIONS: string[] = (nav as { agentInstructions?: string[] }).agentInstructions ?? [];
const SUMMARY = "Linkrunner is a mobile measurement partner (MMP): it attributes app installs, sign-ups, events and revenue to the campaigns that drove them, and sends conversions back to ad networks.";
const MCP_URL = "https://mcp.linkrunner.io/mcp";

/** VitePress transformHead: records the page and links its Markdown copy. */
export function agentHead({ pageData, siteData }: TransformContext): HeadConfig[] {
  if (pageData.isNotFound || pageData.relativePath === "404.md") return [];
  const route = pagePath(pageData.relativePath);
  meta.set(route, {
    title: pageData.title || siteData.title,
    description: pageData.description || pageData.frontmatter.description || "",
  });
  return [["link", { rel: "alternate", type: "text/markdown", href: markdownPath(route) }]];
}

const quote = (lines: string[]) => lines.map((l) => (l ? `> ${l}` : ">")).join("\n");
const mdUrl = (route: string) => SITE_URL + markdownPath(route);
const pageUrl = (route: string) => SITE_URL + (route === "/" ? "/" : route);
const norm = (l: string) => l.replace(/\/$/, "") || "/";

/** Pages in sidebar order: [section heading, routes][], then any page no sidebar lists. */
function sections(pages: Map<string, string>): [string, string[]][] {
  const tabs = relayNav.filter((n): n is DefaultTheme.NavItemWithLink => "link" in n && n.link.startsWith("/"));
  const seen = new Set<string>();
  const out: [string, string[]][] = [];
  relaySidebars.forEach((groups, i) => {
    for (const g of groups) {
      const routes: string[] = [];
      const walk = (items: DefaultTheme.SidebarItem[] = []) => {
        for (const it of items) {
          const r = it.link && norm(it.link);
          if (r && pages.has(r) && !seen.has(r)) {
            routes.push(r);
            seen.add(r);
          }
          walk(it.items);
        }
      };
      walk(g.items);
      if (routes.length) out.push([`${tabs[i]?.text ?? "Docs"}: ${plainText(g.text ?? "")}`, routes]);
    }
  });
  const rest = [...pages.keys()].filter((r) => !seen.has(r)).sort();
  if (rest.length) out.push(["More pages", rest]);
  return out;
}

function llmsTxt(groups: [string, string[]][]): string {
  const lines = [
    "# Linkrunner",
    "",
    quote([SUMMARY]),
    "",
    ...(INSTRUCTIONS.length ? [quote(["## Agent Instructions", ...INSTRUCTIONS]), ""] : []),
    `Every page is also served as Markdown: add \`.md\` to its URL (the home page is ${SITE_URL}/index.md). All pages in one file: ${SITE_URL}/llms-full.txt. To search the docs from a tool call, connect the Linkrunner MCP server at ${MCP_URL}; its search_documentation tool works before sign-in.`,
  ];
  for (const [heading, routes] of groups) {
    lines.push("", `## ${heading}`, "");
    for (const r of routes) {
      const m = meta.get(r);
      const title = m?.title || r;
      lines.push(`- [${title}](${mdUrl(r)})${m?.description ? `: ${m.description}` : ""}`);
    }
  }
  lines.push("", "## OpenAPI Specs", "", `- [Linkrunner API](${SITE_URL}/api-reference/openapi.json)`, "");
  return lines.join("\n");
}

/** `# Title\nSource: <url>` per page: the header the MCP's parser expects. */
function llmsFull(groups: [string, string[]][], pages: Map<string, string>): string {
  const parts = [`# Linkrunner\n\n${quote([SUMMARY])}\n\n${INSTRUCTIONS.length ? quote(["## Agent Instructions", ...INSTRUCTIONS]) + "\n\n" : ""}Page index: ${SITE_URL}/llms.txt\n`];
  for (const [, routes] of groups) {
    for (const r of routes) {
      const md = pages.get(r)!;
      // The page copy is "# Title\n\nSource: <url>\n\n<body>" (agent-markdown.ts).
      parts.push(md.replace(/^(# .+)\n\nSource: (\S+)\n/m, "$1\nSource: $2\n").trimEnd() + "\n");
    }
  }
  return parts.join("\n");
}

function skillMd(): string {
  return `---
name: linkrunner
description: Use when integrating the Linkrunner SDK or web SDK, setting up deep links or trackable campaign links, connecting ad networks (Meta, Google, TikTok, Apple Search Ads), sending events, revenue or webhooks, testing attribution, or answering questions about Linkrunner mobile attribution.
---

# Linkrunner

${SUMMARY}

## How to read these docs

1. Start with the page index: ${SITE_URL}/llms.txt. It lists every page with a one-line description.
2. Fetch a page as Markdown by adding \`.md\` to its URL, for example ${SITE_URL}/quickstart.md. It is much smaller than the HTML page.
3. Need everything at once? ${SITE_URL}/llms-full.txt has every page in one file.
4. To search instead of reading, connect the Linkrunner MCP server at ${MCP_URL} and call \`search_documentation\`. It works before sign-in.

${INSTRUCTIONS.length ? `## Agent instructions\n\n${INSTRUCTIONS.map((l) => `- ${l}`).join("\n")}\n\n` : ""}## Integrate the SDK in a codebase

Install the skill for the app's platform from the \`@linkrunner/skills\` package, then follow it:

\`\`\`bash
npx @linkrunner/skills list
npx @linkrunner/skills add <platform>
\`\`\`

Guide: ${pageUrl("/ai-agent-skills")}

## Start here

- [Quickstart](${mdUrl("/quickstart")}): set up Linkrunner and check the first attributed install
- [Integration testing](${mdUrl("/testing/integration-testing")}): verify click, install and sign-up end to end
- [Create a trackable link](${mdUrl("/features/create-trackable-link")})
- [Data APIs](${mdUrl("/api-reference/data-apis")})
- [Webhooks](${mdUrl("/features/webhooks")})

Support: support@linkrunner.io
`;
}

const ROBOTS = `User-agent: *
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

/** VitePress buildEnd: writes the agent files. `pages` is route -> page Markdown. */
export function writeAgentFiles(site: SiteConfig, pages: Map<string, string>): string[] {
  const groups = sections(pages);
  const llms = llmsTxt(groups);
  const skill = skillMd();
  const files: Record<string, string> = {
    "llms.txt": llms,
    ".well-known/llms.txt": llms,
    "llms-full.txt": llmsFull(groups, pages),
    "skill.md": skill,
    ".well-known/skills/linkrunner/SKILL.md": skill,
    ".well-known/skills/index.json": JSON.stringify({
      skills: [{ name: "linkrunner", description: skill.match(/^description: (.*)$/m)![1], files: ["SKILL.md"] }],
    }) + "\n",
    "robots.txt": ROBOTS,
  };
  for (const [name, body] of Object.entries(files)) {
    const out = join(site.outDir, name);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, body);
  }
  return Object.keys(files);
}
