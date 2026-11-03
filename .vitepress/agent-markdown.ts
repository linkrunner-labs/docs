/**
 * "Copy page" for the Relay build (docs.v2): every page is also published as
 * plain Markdown at <route>.md (index at /index.md), for readers to paste into
 * an AI coding agent. Built from the same rewritten source as the page
 * (relay-markdown.ts), then:
 * - Mintlify-style components become plain Markdown: callouts are quotes,
 *   steps are numbered bold lines, tabs and accordions are bold labels, cards
 *   are links,
 * - the "Before you start" box becomes a short list, the setup video a link,
 * - links and images point at the full docs.v2 URL so an agent can follow them,
 * - code blocks pass through untouched.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { SiteConfig } from "vitepress";
import { rewrite, routeOf } from "./relay-markdown";
import { SITE_URL } from "./og";
import beforeYouStart from "./relay-before-you-start.json";

type Entry = { for: string; needs: string[]; time: string };

const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&");
const abs = (url: string) => (url.startsWith("/") ? SITE_URL + url : url);
const CALLOUTS: Record<string, string> = { Note: "Note", Tip: "Tip", Warning: "Warning", Info: "Info" };
// Wrappers that only group their children.
const DROP = /^<\/?(Steps|Tabs|CardGroup|AccordionGroup|Frame|Step|Tab|Accordion|Card)\b[^>]*>$/;

function inline(line: string, url: string): string {
  return (
    line
      // In-page anchors -> full URL, so they still work once pasted.
      .replace(/(\]\()(#[^)\s]+)/g, (_, open: string, hash: string) => open + url + hash)
      // <img src alt> -> ![alt](src)
      .replace(/<img\b[^>]*>/g, (t) => `![${attr(t, "alt") ?? ""}](${abs(attr(t, "src") ?? "")})`)
      .replace(/<br\s*\/?>/g, "  ")
      // Root-relative Markdown links and images -> full URLs.
      .replace(/(\]\()(\/[^)\s]*)/g, (_, open: string, url: string) => open + abs(url))
      // Heading attributes: "## Title {#id .class}".
      .replace(/^(#{1,6} .*?)\s*\{[#.][^}]*\}\s*$/, "$1")
      // Leftover inline HTML wrappers keep their text.
      .replace(/<\/?(span|p|strong|em|code|div|summary|details)\b[^>]*>/g, "")
  );
}

function beforeBox(route: string): string[] {
  const e = (beforeYouStart as Record<string, Entry>)[route];
  if (!e) return [];
  return ["**Before you start**", "", `- For: ${e.for}`, `- Time: ${e.time}`, ...e.needs.map((n) => `- You need: ${n}`), ""];
}

/** Agent-friendly Markdown for one page. `src` is the page's raw source. */
export function toAgentMarkdown(src: string, relativePath: string): string {
  const route = routeOf(relativePath);
  const pageUrl = SITE_URL + (route === "/" ? "/" : route);
  let text = rewrite(src, relativePath);

  const fmTitle = text.match(/^---\n[\s\S]*?^title:\s*"?(.*?)"?\s*$/m)?.[1];
  // Frontmatter and page scripts carry nothing a reader needs.
  text = text.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/<script\b[\s\S]*?<\/script>/g, "");
  // SDK checklist: the headings below say the same thing.
  text = text.replace(/<div class="lr-checklist">[\s\S]*?\n<\/div>\n/, "");
  // Setup video disclosure -> one link.
  text = text.replace(/<details class="lr-video">[\s\S]*?youtube\.com\/embed\/([\w-]+)[\s\S]*?<\/details>/g, (_, id: string) =>
    `Video walkthrough: https://www.youtube.com/watch?v=${id}`
  );

  const out: string[] = [];
  const quote: string[] = []; // open callouts, innermost last
  const steps: number[] = []; // step counter per open <Steps>
  let fence: string | null = null;
  let skipping = false; // inside a multi-line self-closing component

  const push = (line: string) => out.push(quote.length ? `${"> ".repeat(quote.length)}${line}`.trimEnd() : line);

  for (const raw of text.split("\n")) {
    const line = raw.trim();

    // Code blocks pass through untouched.
    const f = raw.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      push(raw);
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length && raw.trim() === f[1]) fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      push(raw);
      continue;
    }

    if (skipping) {
      if (/\/?>$/.test(line)) skipping = false;
      continue;
    }
    // A component tag spread over several lines (<HelpBox\n  title=…\n/>).
    if (/^<[A-Z]\w*$/.test(line) || /^<[A-Z]\w*\s[^>]*$/.test(line)) {
      skipping = true;
      continue;
    }
    // Decorative eyebrow labels.
    if (/^<SectionLabel\b.*<\/SectionLabel>$/.test(line)) continue;

    // One-line forms: <Note>text</Note>, <Step title="X">text</Step>.
    const oneCallout = line.match(/^<(Note|Tip|Warning|Info)\b[^>]*>(.*)<\/\1>$/);
    if (oneCallout) {
      push(`> **${CALLOUTS[oneCallout[1]]}:** ${inline(oneCallout[2], pageUrl)}`);
      continue;
    }
    const oneItem = line.match(/^<(Step|Tab|Accordion)\b([^>]*)>(.*)<\/\1>$/);
    if (oneItem) {
      const title = attr(oneItem[2], "title") ?? "";
      const n = oneItem[1] === "Step" && steps.length ? `${++steps[steps.length - 1]}. ` : "";
      push(`**${n}${title}** ${inline(oneItem[3], pageUrl)}`.trimEnd());
      continue;
    }

    const open = line.match(/^<(Note|Tip|Warning|Info)\b[^>]*>$/);
    if (open) {
      quote.push(open[1]);
      push(`**${CALLOUTS[open[1]]}:**`);
      push("");
      continue;
    }
    if (/^<\/(Note|Tip|Warning|Info)>$/.test(line)) {
      quote.pop();
      out.push("");
      continue;
    }
    if (line === "<BeforeYouStart />") {
      beforeBox(route).forEach(push);
      continue;
    }

    if (/^<Steps\b/.test(line)) steps.push(0);
    if (line === "</Steps>") steps.pop();
    const step = line.match(/^<Step\b[^>]*>$/);
    if (step && steps.length) {
      steps[steps.length - 1]++;
      push(`**${steps[steps.length - 1]}. ${attr(line, "title") ?? ""}**`);
      continue;
    }
    if (/^<(Tab|Accordion)\b/.test(line)) {
      push(`**${attr(line, "title") ?? ""}**`);
      const description = attr(line, "description");
      if (description) push(description);
      continue;
    }
    if (/^<Card\b/.test(line)) {
      const href = attr(line, "href");
      const title = attr(line, "title") ?? "";
      push(href ? `- [${title}](${abs(href)})` : `- **${title}**`);
      continue;
    }
    if (/^<Frame\b/.test(line) && attr(line, "caption")) {
      push(`*${attr(line, "caption")}*`);
      continue;
    }
    if (DROP.test(line)) continue;
    // Other components on their own line (page sections, embeds): skip.
    if (/^<[A-Z][\w]*\b[^>]*\/>$/.test(line)) continue;
    if (/^<iframe\b/.test(line)) {
      const s = attr(line, "src");
      if (s) push(s);
      continue;
    }

    push(inline(raw, pageUrl));
  }

  const body = out
    .join("\n")
    // One blank line at most, inside quotes too, and none closing a quote.
    .replace(/^(>[> ]*)\n(?:>[> ]*\n)+/gm, "$1\n")
    .replace(/^>[> ]*\n(?=\n|$)/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  // Source URL right after the title so a pasted page says where it came from.
  // Pages drawn by components (the Overview) have no H1 of their own.
  if (!/^# /m.test(body)) return `# ${fmTitle ?? "Linkrunner docs"}\n\nSource: ${pageUrl}\n\n${body}\n`;
  return body.replace(/^(# .+)$/m, `$1\n\nSource: ${pageUrl}`) + "\n";
}

/** Path of a page's Markdown copy, as served. */
export const markdownPath = (route: string) => (route === "/" ? "/index.md" : `${route}.md`);

// Mintlify starts every Markdown page with the same pointer to the index.
const INDEX_NOTE = `> ## Documentation Index
> Fetch the complete documentation index at: ${SITE_URL}/llms.txt
> Use this file to discover all available pages before exploring further.

`;

/**
 * VitePress buildEnd: writes <outDir>/<route>.md for every page, and returns
 * route -> Markdown (without the index note) for agent-files.ts.
 */
export function writeAgentMarkdown(site: SiteConfig): Map<string, string> {
  const pages = new Map<string, string>();
  for (const page of site.pages) {
    const dest = site.rewrites.map[page] ?? page;
    if (dest === "404.md") continue;
    const route = routeOf(dest);
    const md = toAgentMarkdown(readFileSync(join(site.srcDir, page), "utf8"), dest);
    const file = join(site.outDir, markdownPath(route));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, INDEX_NOTE + md);
    pages.set(route, md);
  }
  return pages;
}
