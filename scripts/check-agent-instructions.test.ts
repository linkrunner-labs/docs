/**
 * Contributor files for AI agents: AGENTS.md, CLAUDE.md and skills/.
 * Ported from the Mintlify repository's scripts/check-doc-agent-files.test.mjs.
 * Run: bun run check:agents
 */
import { describe, expect, test } from "bun:test";
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, readlinkSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const SKILLS = readdirSync(resolve(root, "skills"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

function checkSkillMetadata(text: string, name: string) {
  const match = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
  if (!match) throw new Error("Skill needs frontmatter and a body");
  expect(match[1]).toMatch(new RegExp(`^name: ${name}$`, "m"));
  const description = match[1].match(/^description: (.+)$/m)?.[1] ?? "";
  if (!description.startsWith("Use when ")) throw new Error("Put the trigger first");
  if (description.length > 60) throw new Error("Keep the trigger readable in skill catalogs");
  expect(description.endsWith(".")).toBe(true);
  expect(match[2].trim().length).toBeGreaterThan(0);
}

function checkSkillLink(entry: string, canonical: string) {
  if (!lstatSync(entry).isSymbolicLink()) throw new Error("Use a shared directory, not a copy");
  if (isAbsolute(readlinkSync(entry))) throw new Error("Use a relative discovery link");
  expect(realpathSync(entry)).toBe(realpathSync(canonical));
  expect(existsSync(resolve(entry, "SKILL.md"))).toBe(true);
}

describe("checker", () => {
  for (const [label, newline] of [["LF", "\n"], ["CRLF", "\r\n"]]) {
    test(`skill metadata accepts ${label} line endings`, () => {
      checkSkillMetadata(["---", "name: fixture", "description: Use when testing metadata.", "---", "# Fixture", ""].join(newline), "fixture");
    });
  }

  test("discovery links reject absolute targets even when they resolve correctly", () => {
    const fixture = mkdtempSync(resolve(tmpdir(), "doc-agent-links-"));
    try {
      const canonical = resolve(fixture, "canonical");
      mkdirSync(canonical);
      writeFileSync(resolve(canonical, "SKILL.md"), "# Fixture\n");
      symlinkSync("canonical", resolve(fixture, "relative"), "dir");
      symlinkSync(canonical, resolve(fixture, "absolute"), "dir");
      expect(() => checkSkillLink(resolve(fixture, "relative"), canonical)).not.toThrow();
      expect(() => checkSkillLink(resolve(fixture, "absolute"), canonical)).toThrow(/Use a relative discovery link/);
    } finally {
      rmSync(fixture, { recursive: true, force: true });
    }
  });
});

test("Claude imports the shared policy without a second rule set", () => {
  expect(existsSync(resolve(root, "AGENTS.md"))).toBe(true);
  expect(read("CLAUDE.md").trim()).toBe("@AGENTS.md");
  expect(read("AGENTS.md")).toMatch(/^# Linkrunner Docs/m);
});

test("discovery folders hold only links to skills/", () => {
  for (const agent of [".agents", ".claude"]) {
    const entries = readdirSync(resolve(root, agent, "skills")).sort();
    expect(entries).toEqual([...SKILLS].sort());
  }
});

test("the expected skills exist", () => {
  expect(SKILLS.sort()).toEqual(["docs-implementation-audit", "linkrunner-docs-writing"]);
});

for (const name of SKILLS) {
  test(`${name} is shared by Claude and Codex discovery`, () => {
    const canonical = resolve(root, "skills", name);
    for (const agent of [".agents", ".claude"]) {
      const entry = resolve(root, agent, "skills", name);
      expect(existsSync(entry)).toBe(true);
      checkSkillLink(entry, canonical);
    }
  });

  test(`${name} has a discoverable name and task trigger`, () => {
    checkSkillMetadata(read(`skills/${name}/SKILL.md`), name);
  });
}

test("shared policy and skill references resolve inside the repository", () => {
  const files = [resolve(root, "AGENTS.md")];
  const dirs = [resolve(root, "skills")];
  while (dirs.length) {
    const dir = dirs.pop()!;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) dirs.push(path);
      if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
    }
  }
  for (const path of files) {
    const text = readFileSync(path, "utf8");
    const label = relative(root, path);
    if (text.includes("\u2014")) throw new Error(`${label}: avoid em dashes`);
    if (/\/(?:home|Users|tmp)\//.test(text)) throw new Error(`${label}: avoid machine-local paths`);
    const prose = text.replace(/```[\s\S]*?```/g, "");
    for (const [, href] of prose.matchAll(/\[[^\]\n]+\]\(([^)\s]+)\)/g)) {
      if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("/")) continue;
      const file = decodeURIComponent(href.split(/[?#]/, 1)[0]);
      if (!file) continue;
      const target = resolve(dirname(path), file);
      if (!existsSync(target)) throw new Error(`${label}: broken reference ${href}`);
      const inside = relative(root, realpathSync(target));
      if (inside === ".." || inside.startsWith(`..${sep}`)) throw new Error(`${label}: reference leaves repository`);
    }
  }
});

test("AGENTS.md section links point at real headings", () => {
  const agents = read("AGENTS.md");
  const slug = (h: string) => h.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
  const ids = new Set([...agents.matchAll(/^#{1,6} (.+)$/gm)].map((m) => slug(m[1])));
  const files = [resolve(root, "AGENTS.md"), ...SKILLS.map((s) => resolve(root, "skills", s, "SKILL.md"))];
  for (const f of files) {
    for (const [, hash] of readFileSync(f, "utf8").matchAll(/AGENTS\.md#([\w-]+)/g)) {
      if (!ids.has(hash)) throw new Error(`${relative(root, f)}: AGENTS.md#${hash} is not a heading`);
    }
  }
});
