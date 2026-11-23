/**
 * Mintlify (.mdx) -> VitePress (.md) converter.
 *
 * Parses each MDX file into an mdast tree (remark + remark-mdx), then re-emits
 * VitePress-safe Markdown:
 *   - Mintlify components (<Note>, <Card>, <Tabs>, <Steps>, ...) are kept as
 *     Vue components (registered globally in the VitePress theme). Their inner
 *     content is de-indented and blank-line padded so Markdown renders inside
 *     the component slot (VitePress treats indented content as code blocks).
 *   - JSX-isms are converted: style={{...}} -> style="...", className -> class,
 *     cols={2} -> :cols="2", boolean attrs (allowFullScreen) -> lowercased.
 *   - Frontmatter is trimmed to title/description; an H1 + lead paragraph are
 *     injected to mirror Mintlify's title/subtitle header.
 *   - Image URLs with spaces are percent-encoded.
 *
 * Run: bun run scripts/convert.ts
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { parse as parseYaml } from "yaml";

// Local Mintlify source (override with MINTLIFY_SRC, default ../docs). Output
// goes to this repo (run from its root). Conversion is local-only; CI never
// runs this script (the .md output is committed).
const SRC = resolve(process.env.MINTLIFY_SRC || "../docs");
const OUT = resolve(process.env.DOCS_V2_OUT || ".");

// Files/dirs that are leftover Mintlify starter templates, not real content.
const SKIP = [
  "api-reference/endpoint/", // sample "Plant Store" OpenAPI pages, not in nav
  "snippets/", // default Mintlify snippet, unused (no MDX imports anywhere)
];

const VOID_HTML = new Set([
  "img", "br", "hr", "input", "meta", "link", "source", "area",
  "base", "col", "embed", "param", "track", "wbr",
]);

const isComponent = (name: string | null | undefined) => !!name && /^[A-Z]/.test(name);
const camelToKebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const encodeUrlSpaces = (u: string) => u.replace(/ /g, "%20");

// Rewrite internal links so they point directly at real pages: apply Mintlify's
// own docs.json redirects (e.g. /sdk/android/usage -> /sdk/android) plus a few
// fixes for links that are broken in the source too. Redirect stub pages are
// still generated separately for external/bookmarked URLs.
const REDIRECTS = new Map<string, string>();
try {
  const dj = JSON.parse(readFileSync(join(SRC, "docs.json"), "utf8"));
  for (const r of dj.redirects || []) REDIRECTS.set(r.source, r.destination);
  // Persist redirects so the CI build (gen-redirects.ts) doesn't need the
  // Mintlify source. Committed to the repo.
  mkdirSync(join(OUT, ".vitepress"), { recursive: true });
  writeFileSync(
    join(OUT, ".vitepress/redirects.json"),
    JSON.stringify(dj.redirects || [], null, 2)
  );
} catch {
  /* ignore */
}
const LINK_FIXES = new Map<string, string>([
  ["/features/deep-linking", "/features/deep-linking-setup"],
  ["/sdk/skadnetwork-integration", "/features/skadnetwork-integration"],
  ["/api-reference/introduction", "/api-reference/data-apis"],
]);
function rewriteInternal(url: string): string {
  if (!url || !url.startsWith("/")) return url;
  const cut = Math.min(
    ...[url.indexOf("#"), url.indexOf("?")].filter((i) => i >= 0).concat([url.length])
  );
  const path = url.slice(0, cut);
  const suffix = url.slice(cut);
  const dest = LINK_FIXES.get(path) || REDIRECTS.get(path);
  return dest ? dest + suffix : url;
}

/** Convert a JSX style object expression text to a CSS string. */
function styleObjToCss(exprText: string): string | null {
  try {
    // exprText is the inner expression, e.g. `{ maxHeight: 480, width: "100%" }`
    const obj = new Function("return (" + exprText + ")")();
    if (obj == null || typeof obj !== "object") return null;
    return Object.entries(obj)
      .map(([k, v]) => {
        const key = camelToKebab(k);
        const val = typeof v === "number" ? `${v}px` : String(v);
        return `${key}: ${val}`;
      })
      .join("; ");
  } catch {
    return null;
  }
}

/** Serialize JSX attributes into a Vue/HTML-compatible attribute string. */
function serializeAttrs(attributes: any[], isComp: boolean): string {
  if (!attributes || !attributes.length) return "";
  const out: string[] = [];
  for (const a of attributes) {
    if (a.type === "mdxJsxExpressionAttribute") continue; // {...spread} — drop
    let name: string = a.name;
    const val = a.value;

    // Boolean attribute (no value): controls, allowFullScreen, ...
    if (val == null) {
      out.push(isComp ? name : name.toLowerCase());
      continue;
    }

    // Plain string attribute: title="x", src="/images/.."
    if (typeof val === "string") {
      if (!isComp) {
        if (name === "className") name = "class";
        name = name.toLowerCase();
      }
      let v = val;
      if (name === "href") v = rewriteInternal(v);
      if (name === "src" || name === "href") v = encodeUrlSpaces(v);
      // HTML attributes can't backslash-escape quotes (title="\"Ads account\""),
      // so encode them as entities, which Vue decodes.
      out.push(`${name}="${v.replace(/"/g, "&quot;")}"`);
      continue;
    }

    // Expression value: style={{...}}, cols={2}, prop={true}
    const expr: string = (val.value || "").trim();
    if (name === "style") {
      const css = styleObjToCss(expr);
      if (css != null) out.push(`style=${JSON.stringify(css)}`);
      continue;
    }
    if (!isComp) {
      if (name === "className") name = "class";
      out.push(`${name.toLowerCase()}=${JSON.stringify(expr.replace(/^["']|["']$/g, ""))}`);
      continue;
    }
    // Component prop bound to an expression -> Vue binding (:cols="2")
    out.push(`:${name}=${JSON.stringify(expr)}`);
  }
  return out.length ? " " + out.join(" ") : "";
}

/**
 * Mintlify <CodeGroup> -> VitePress `::: code-group`. Mintlify puts the tab
 * label after the language (```bash cURL); VitePress wants it in brackets
 * (```bash [cURL]).
 */
function codeGroup(node: any, state: any, info: any): string {
  const blocks = node.children.map((child: any) => {
    if (child.type !== "code") return state.handle(child, node, state, info);
    const value: string = child.value || "";
    const longest = Math.max(2, ...(value.match(/`+/g) || []).map((m: string) => m.length));
    const fence = "`".repeat(longest + 1);
    const title = (child.meta || "").trim();
    const fenceInfo = [child.lang || "", title ? `[${title}]` : ""].filter(Boolean).join(" ");
    return `${fence}${fenceInfo}\n${value}\n${fence}`;
  });
  return `::: code-group\n\n${blocks.join("\n\n")}\n\n:::`;
}

/** unified plugin: override stringify handlers for MDX JSX + expression nodes. */
function remarkVitepress(this: any) {
  const data = this.data();
  const toMd = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);

  const flowJsx = (node: any, _parent: any, state: any, info: any) => {
    if (node.name === "CodeGroup") return codeGroup(node, state, info);
    if (!node.name) {
      // Fragment <>...</> — emit children only
      const tracker = state.createTracker(info);
      return state.containerFlow(node, tracker.current());
    }
    const isComp = isComponent(node.name);
    const attrs = serializeAttrs(node.attributes, isComp);
    if (!node.children || node.children.length === 0) {
      if (isComp || VOID_HTML.has(node.name)) return `<${node.name}${attrs} />`;
      return `<${node.name}${attrs}></${node.name}>`;
    }
    const exit = state.enter("mdxJsxFlowElement");
    const tracker = state.createTracker(info);
    const inner = state.containerFlow(node, tracker.current());
    exit();
    return `<${node.name}${attrs}>\n\n${inner}\n\n</${node.name}>`;
  };

  const textJsx = (node: any, _parent: any, state: any, info: any) => {
    if (!node.name) return state.containerPhrasing(node, info);
    const isComp = isComponent(node.name);
    const attrs = serializeAttrs(node.attributes, isComp);
    if (!node.children || node.children.length === 0) return `<${node.name}${attrs} />`;
    const inner = state.containerPhrasing(node, { ...info, before: "", after: "" });
    return `<${node.name}${attrs}>${inner}</${node.name}>`;
  };

  const expr = (node: any) => {
    const v = (node.value || "").trim();
    if (!v || v.startsWith("/*")) return ""; // drop MDX comments / empty
    return "{" + node.value + "}"; // literal — single braces are safe in VitePress
  };

  toMd.push({
    handlers: {
      mdxJsxFlowElement: flowJsx,
      mdxJsxTextElement: textJsx,
      mdxFlowExpression: expr,
      mdxTextExpression: expr,
    },
  });
}

/** Transform frontmatter: keep title/description, inject H1 + lead paragraph. */
function remarkFrontmatterHeader(this: any) {
  return (tree: any) => {
    const first = tree.children[0];
    if (first && first.type === "yaml") {
      let fm: any;
      try {
        fm = parseYaml(first.value) || {};
      } catch {
        fm = {};
      }
      const title = fm.title ? String(fm.title) : "";
      const description = fm.description ? String(fm.description) : "";
      const kept: string[] = [];
      if (title) kept.push(`title: ${JSON.stringify(title)}`);
      if (description) kept.push(`description: ${JSON.stringify(description)}`);
      first.value = kept.join("\n");

      const inject: any[] = [];
      if (title) {
        inject.push({ type: "heading", depth: 1, children: [{ type: "text", value: title }] });
      }
      if (description) {
        const esc = description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // Raw HTML node so the class survives Markdown stringification (mirrors
        // Mintlify's title + subtitle header).
        inject.push({ type: "html", value: `<p class="vp-lead">${esc}</p>` });
      }
      tree.children.splice(1, 0, ...inject);
    }

    // Percent-encode spaces in markdown image URLs.
    visit(tree, "image", (n: any) => {
      if (n.url) n.url = encodeUrlSpaces(n.url);
    });

    // Rewrite internal links (markdown links + link reference definitions).
    visit(tree, ["link", "definition"], (n: any) => {
      if (n.url) n.url = rewriteInternal(n.url);
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkGfm)
  .use(remarkMdx)
  .use(remarkFrontmatterHeader)
  .use(remarkVitepress)
  .use(remarkStringify, {
    bullet: "-",
    fences: true,
    rule: "-",
    listItemIndent: "one",
    resourceLink: false,
  });

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === "node_modules" || entry === ".git" || entry.startsWith(".")) continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (entry.endsWith(".mdx")) acc.push(full);
  }
  return acc;
}

/**
 * The MDX-aware stringifier defensively backslash-escapes punctuation. These
 * render correctly in CommonMark but are noisy in source. Unescape only the
 * provably-safe cases, and never inside fenced/inline code.
 *   - intraword `\_` (CommonMark never treats intraword `_` as emphasis)
 *   - `\&` (ampersand is never Markdown syntax)
 */
function tidyEscapes(md: string): string {
  const blocks = md.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g);
  return blocks
    .map((block, bi) => {
      if (bi % 2 === 1) return block; // fenced code — leave verbatim
      const spans = block.split(/(`[^`\n]*`)/g);
      return spans
        .map((span, si) => {
          if (si % 2 === 1) return span; // inline code — leave verbatim
          return span.replace(/(?<=\w)\\_(?=\w)/g, "_").replace(/\\&/g, "&");
        })
        .join("");
    })
    .join("");
}

/**
 * Lines that MDX reads as a quote by accident: a wrapped sentence whose next
 * line starts with ">" and text (">=4.3.2** ..."). Mintlify renders the same
 * stray quote, so fix the source. Skips real quotes ("> text") and the ">"
 * that closes a multi-line JSX tag.
 */
function accidentalQuotes(src: string): number[] {
  const lines = src.split("\n");
  const hits: number[] = [];
  let fence = false;
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (fence || i === 0 || lines[i - 1].trim() === "") return;
    if (/^\s*>[^\s>/<]/.test(line)) hits.push(i + 1);
  });
  return hits;
}

const files = walk(SRC);
let ok = 0;
const failed: { file: string; err: string }[] = [];
const quoteWarnings: string[] = [];

for (const file of files) {
  const rel = relative(SRC, file);
  if (SKIP.some((s) => rel.startsWith(s))) continue;
  try {
    const src = readFileSync(file, "utf8");
    for (const line of accidentalQuotes(src)) quoteWarnings.push(`${rel}:${line}`);
    const result = tidyEscapes(String(processor.processSync(src)));
    const outPath = join(OUT, rel.replace(/\.mdx$/, ".md"));
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, result);
    ok++;
  } catch (e: any) {
    failed.push({ file: rel, err: e.message?.split("\n")[0] || String(e) });
  }
}

console.log(`Converted ${ok} files.`);
if (quoteWarnings.length) {
  console.log(`\nWARNING: ${quoteWarnings.length} line(s) start with ">" mid-paragraph and render as a quote on both sites.`);
  console.log("Rewrap them in the Mintlify source so no line starts with \">\":");
  for (const w of quoteWarnings) console.log(`  - ${w}`);
}
if (failed.length) {
  console.log(`\n${failed.length} FAILED:`);
  for (const f of failed) console.log(`  - ${f.file}: ${f.err}`);
}
