/**
 * Quick check of Ask AI link sanitising (theme-relay/ask-ai/markdown.ts):
 * hrefs that a browser could read as another host or scheme must never
 * render as links or be treated as same-site paths.
 *
 * Run: bun run scripts/check-ask-ai-links.ts
 */
import { internalPath, renderMarkdown } from "../.vitepress/theme-relay/ask-ai/markdown";

const BAD = [
  "/\\evil.com",
  "/\\\\evil.com",
  "\\\\evil.com",
  "/%5Cevil.com",
  "/%5cevil.com",
  "//evil.com",
  "/\t/evil.com",
  "/%09/evil.com",
  "/%2F%2Fevil.com",
  "https://docs.v2.linkrunner.io//evil.com",
  "https://docs.v2.linkrunner.io/\\evil.com",
  "javascript:alert(1)",
  "JaVaScRiPt:alert(1)",
  "data:text/html;base64,PHNjcmlwdD4=",
  "vbscript:msgbox(1)",
];
const GOOD: [string, string][] = [
  ["/features/deep-linking-setup", "/features/deep-linking-setup"],
  ["https://docs.v2.linkrunner.io/sdk/flutter#install", "/sdk/flutter#install"],
];

let failed = 0;
const fail = (msg: string) => {
  failed++;
  console.error(`FAIL ${msg}`);
};

for (const href of BAD) {
  if (internalPath(href) !== null) fail(`internalPath(${JSON.stringify(href)}) = ${internalPath(href)}`);
  // Whatever markdown-it makes of it, every rendered href must be a plain
  // http(s)/mailto URL or a clean site path.
  const html = renderMarkdown(`[x](${href.replace(/\\/g, "\\\\")}) and <${href}> and ${href}`);
  for (const [, h] of html.matchAll(/href="([^"]*)"/g)) {
    const clean = !/\\|%5c/i.test(h);
    const ok = clean && (/^(https?:\/\/|mailto:)/i.test(h) || (h.startsWith("/") && !h.startsWith("//")));
    if (!ok) fail(`unsafe href ${JSON.stringify(h)} rendered for ${JSON.stringify(href)}`);
    if (h.startsWith("/") && html.includes(`href="${h}" data-lr-internal`) && h !== "/" && BAD.includes(h))
      fail(`${JSON.stringify(h)} treated as a site path`);
  }
}
for (const [href, path] of GOOD) {
  if (internalPath(href) !== path) fail(`internalPath(${JSON.stringify(href)}) = ${internalPath(href)}, want ${path}`);
  if (!/<a\s/i.test(renderMarkdown(`[x](${href})`))) fail(`no link rendered for ${JSON.stringify(href)}`);
}
if (!/<a href="https:\/\/linkrunner\.io" target="_blank" rel="noopener noreferrer">/.test(renderMarkdown("[x](https://linkrunner.io)")))
  fail("external link is missing target/rel");

if (failed) {
  console.error(`${failed} link check(s) failed.`);
  process.exit(1);
}
console.log(`Ask AI link checks passed (${BAD.length} unsafe, ${GOOD.length} safe).`);
