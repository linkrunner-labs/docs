/**
 * Audit internal links across the converted Markdown. Reports links to pages
 * or assets that don't exist. Run: bun run scripts/check-links.ts
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

// Run from the repo root.
const ROOT = resolve(process.env.DOCS_V2_OUT || ".");

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".vitepress" || e === "public" || e === "skills" || e === "AGENTS.md" || e === "CLAUDE.md" || e.startsWith(".")) continue;
    const full = join(dir, e);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (e.endsWith(".md")) acc.push(full);
  }
  return acc;
}

function pageExists(p: string): boolean {
  // p is a clean internal path like /sdk/web or /features/x
  const clean = p.replace(/\/$/, "");
  if (clean === "" || clean === "/") return existsSync(join(ROOT, "index.md"));
  return (
    existsSync(join(ROOT, clean + ".md")) ||
    existsSync(join(ROOT, clean, "index.md"))
  );
}

function assetExists(p: string): boolean {
  return existsSync(join(ROOT, "public", decodeURIComponent(p)));
}

const files = walk(ROOT);
const misses: { file: string; link: string }[] = [];

const linkRe = /\]\((\/[^)\s]+)\)|href="(\/[^"]+)"/g;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(src))) {
    let url = (m[1] || m[2])!;
    url = url.split("#")[0].split("?")[0];
    if (!url) continue;
    if (url.startsWith("/images/") || url.startsWith("/logo/") || /\.\w+$/.test(url)) {
      if (!assetExists(url)) misses.push({ file: relative(ROOT, file), link: url });
      continue;
    }
    if (!pageExists(url)) misses.push({ file: relative(ROOT, file), link: url });
  }
}

if (misses.length === 0) {
  console.log("No broken internal links.");
} else {
  console.log(`${misses.length} broken internal link(s):`);
  for (const m of misses) console.log(`  ${m.file}  ->  ${m.link}`);
}
