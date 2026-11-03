/**
 * markdown-it plugin: give headings, tabs and accordions the anchor ids
 * docs.linkrunner.io (Mintlify) gave them (mintlify-slug.ts), so shared links
 * like /features/create-trackable-link#1-open-create-link land on the same
 * section. Used by both builds.
 *
 * - Headings: sets the id before VitePress's anchor plugin runs, which keeps
 *   an id that is already there. `## Title {#id}` still wins.
 * - <Tab title> and <Accordion title> get an `anchor` prop with Mintlify's id;
 *   the components render it and open or select themselves when the URL
 *   hash names it.
 */
import type MarkdownIt from "markdown-it";
import type { MarkdownRenderer } from "vitepress";
import { accordionIds, headingIds, slugClaimer, smartQuotes, tabIds } from "./mintlify-slug";

type Token = ReturnType<MarkdownIt["parse"]>[number];

// Inline code is left alone by Mintlify's smart quotes; text is curled.
const CODE_QUOTE = { '"': "\uE000", "'": "\uE001" } as const;
function headingText(children: Token[] = []): string {
  const raw = children
    .filter((t) => t.type === "text" || t.type === "code_inline")
    .map((t) => (t.type === "code_inline" ? t.content.replace(/["']/g, (q) => CODE_QUOTE[q as '"' | "'"]) : t.content))
    .join("");
  return smartQuotes(raw).replace(/\uE000/g, '"').replace(/\uE001/g, "'");
}

/**
 * `href="#lr-heading:<encoded heading text>"` points at a heading whose id
 * isn't known when the Markdown is written (relay-markdown.ts checklists);
 * it becomes the heading's id.
 */
export const HEADING_REF = "lr-heading:";

const unescape = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export function legacyAnchors(md: MarkdownRenderer) {
  md.core.ruler.before("anchor", "lr-mintlify-heading-ids", (state) => {
    // Mintlify ids levels 1 to 4; deeper headings get ids from their own
    // counter so they don't shift the numbering of the others.
    const next = headingIds();
    const deep = headingIds();
    const taken = slugClaimer();
    const tokens = state.tokens;
    const lines = state.src.split("\n");
    const bySource = new Map<string, string>();
    for (const t of tokens) if (t.type === "heading_open" && t.attrGet("id")) taken(t.attrGet("id")!);
    let first = true;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.type !== "heading_open") continue;
      // The page title (the H1 convert.ts adds) sits outside Mintlify's content,
      // so it doesn't count towards repeats.
      const isTitle = first && t.tag === "h1";
      first = false;
      if (!t.attrGet("id")) {
        const text = headingText(tokens[i + 1]?.children ?? []);
        const id = (Number(t.tag.slice(1)) <= 4 && !isTitle ? next : deep)(text);
        if (id) t.attrSet("id", taken(id));
      }
      const source = t.map ? lines[t.map[0]]?.replace(/^#{1,6}\s+/, "").replace(/\s*\{[^}]*\}\s*$/, "").trim() : undefined;
      if (source && t.attrGet("id") && !bySource.has(source)) bySource.set(source, t.attrGet("id")!);
    }
    if (!bySource.size) return;
    const ref = new RegExp(`href="#${HEADING_REF}([^"]*)"`, "g");
    for (const t of tokens) {
      if (t.type !== "html_block" || !t.content.includes(HEADING_REF)) continue;
      t.content = t.content.replace(ref, (m, enc: string) => {
        const id = bySource.get(decodeURIComponent(enc));
        return id ? `href="#${escape(id)}"` : m;
      });
    }
  });

  md.core.ruler.push("lr-mintlify-component-ids", (state) => {
    const tab = tabIds();
    const accordion = accordionIds();
    const tag = (html: string) =>
      html.replace(/<(Tab|Accordion)(\s[^>]*?)?(\/?)>/g, (m, name: string, attrs = "", close: string) => {
        if (/\s(anchor|:anchor)=/.test(attrs)) return m;
        const title = attrs.match(/\stitle="([^"]*)"/)?.[1];
        if (title == null) return m;
        const id = name === "Tab" ? tab(unescape(title)) : accordion(unescape(title));
        return `<${name} anchor="${escape(id)}"${attrs}${close}>`;
      });
    for (const t of state.tokens) {
      if (t.type === "html_block") t.content = tag(t.content);
      for (const c of t.children ?? []) if (c.type === "html_inline") c.content = tag(c.content);
    }
  });
}
