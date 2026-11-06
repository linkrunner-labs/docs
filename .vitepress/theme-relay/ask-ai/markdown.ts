import MarkdownIt from "markdown-it";
import { icons } from "../icons";
import { sameSiteHosts } from "./config";

// Renders model output, which is untrusted. Raw HTML is off (html: false), so
// tags show as text. Links must be http(s), mailto or a site path; anything
// else (javascript:, data:, vbscript:...) stays as plain text. Images are off
// so an answer can't load third-party URLs.

const md = new MarkdownIt({ html: false, linkify: true, breaks: false, typographer: false });
md.disable(["image"]);
// Only link URLs written with a scheme, not bare "evil.com" text.
md.linkify.set({ fuzzyLink: false, fuzzyEmail: false });

const SAFE = /^(https?:|mailto:)/i;

/**
 * Hrefs a browser could read as another host or scheme: backslashes (and
 * their encoded form; "/\evil.com" works like "//evil.com"), whitespace or
 * control characters (browsers strip tabs and newlines inside URLs), and
 * protocol-relative "//" paths.
 */
export function unsafeHref(href: string): boolean {
  // oxlint-disable-next-line no-control-regex -- matching control characters is the point
  return /[\\\s\u0000-\u001f\u007f]|%5c|%2f%2f|%09|%0a|%0d/i.test(href);
}

const sitePath = (p: string) => p.startsWith("/") && !p.startsWith("//") && !unsafeHref(p);

md.validateLink = (url: string) => {
  if (unsafeHref(url)) return false;
  if (url.startsWith("/")) return sitePath(url);
  if (url.startsWith("#")) return true;
  return SAFE.test(url);
};

/** The in-site path for a link, or null when it leaves the docs. */
export function internalPath(href: string): string | null {
  if (unsafeHref(href)) return null;
  if (href.startsWith("/")) return sitePath(href) ? href : null;
  try {
    const u = new URL(href);
    if (!/^https?:$/.test(u.protocol) || !sameSiteHosts().includes(u.host)) return null;
    const path = u.pathname + u.search + u.hash;
    return sitePath(path) ? path : null;
  } catch {
    return null;
  }
}

const svg = (name: string) => {
  const i = icons[name];
  return i
    ? `<svg class="lr-ph" viewBox="${i.viewBox}" width="1em" height="1em" aria-hidden="true" focusable="false">${i.body}</svg>`
    : "";
};

md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx];
  const href = token.attrGet("href") || "";
  const path = internalPath(href);
  if (path) {
    token.attrSet("href", path);
    token.attrSet("data-lr-internal", "");
  } else if (!href.startsWith("#")) {
    token.attrSet("target", "_blank");
    token.attrSet("rel", "noopener noreferrer");
  }
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  const lang = md.utils.escapeHtml(token.info.trim().split(/\s+/)[0] || "");
  const code = md.utils.escapeHtml(token.content);
  return (
    `<div class="lr-ask-code">` +
    `<div class="lr-ask-code__bar"><span class="lr-ask-code__lang">${lang}</span>` +
    `<button type="button" class="lr-ask-code__copy" data-lr-copy-code aria-label="Copy code">${svg("copy")}</button></div>` +
    `<pre><code>${code}</code></pre></div>`
  );
};
md.renderer.rules.code_block = md.renderer.rules.fence;

// Wide tables scroll inside the answer instead of stretching the panel.
md.renderer.rules.table_open = () => `<div class="lr-ask-table"><table>`;
md.renderer.rules.table_close = () => `</table></div>`;

export function renderMarkdown(source: string): string {
  return md.render(source);
}
