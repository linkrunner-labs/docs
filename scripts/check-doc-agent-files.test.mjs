import assert from "node:assert/strict";
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, readlinkSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");

function checkSkillMetadata(text, name) {
    const match = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
    assert.ok(match, "Skill needs frontmatter and a body");
    assert.match(match[1], new RegExp(`^name: ${name}$`, "m"));
    const description = match[1].match(/^description: (.+)$/m)?.[1];
    assert.ok(description?.startsWith("Use when "), "Put the trigger first");
    assert.ok(description.length <= 60, "Keep the trigger readable in skill catalogs");
    assert.ok(description.endsWith("."));
    assert.ok(match[2].trim().length > 0);
}

for (const [label, newline] of [["LF", "\n"], ["CRLF", "\r\n"]]) {
    test(`skill metadata accepts ${label} line endings`, () => {
        const text = ["---", "name: fixture", "description: Use when testing metadata.", "---", "# Fixture", ""].join(newline);
        checkSkillMetadata(text, "fixture");
    });
}

function checkSkillLink(entry, canonical) {
    assert.ok(lstatSync(entry).isSymbolicLink(), "Use a shared directory, not a copy");
    assert.ok(!isAbsolute(readlinkSync(entry)), "Use a relative discovery link");
    assert.equal(realpathSync(entry), realpathSync(canonical));
    assert.ok(existsSync(resolve(entry, "SKILL.md")));
}

test("discovery links reject absolute targets even when they resolve correctly", () => {
    const fixture = mkdtempSync(resolve(tmpdir(), "doc-agent-links-"));
    try {
        const canonical = resolve(fixture, "canonical");
        mkdirSync(canonical);
        writeFileSync(resolve(canonical, "SKILL.md"), "# Fixture\n");
        const relativeLink = resolve(fixture, "relative");
        const absoluteLink = resolve(fixture, "absolute");
        symlinkSync("canonical", relativeLink, "dir");
        symlinkSync(canonical, absoluteLink, "dir");
        assert.doesNotThrow(() => checkSkillLink(relativeLink, canonical));
        assert.equal(realpathSync(absoluteLink), realpathSync(canonical));
        assert.throws(() => checkSkillLink(absoluteLink, canonical), /Use a relative discovery link/);
    } finally {
        rmSync(fixture, { recursive: true, force: true });
    }
});

test("Claude imports the shared Codex policy without a second rule set", () => {
    assert.ok(existsSync(resolve(root, "AGENTS.md")), "Missing shared AGENTS.md");
    assert.equal(read("CLAUDE.md").trim(), "@AGENTS.md");
    assert.match(read("AGENTS.md"), /^# Linkrunner Docs/m);
});

for (const name of ["linkrunner-docs-writing", "docs-implementation-audit"]) {
    test(`${name} is shared by Claude and Codex discovery`, () => {
        const canonical = resolve(root, "skills", name);
        for (const agent of [".agents", ".claude"]) {
            const entry = resolve(root, agent, "skills", name);
            assert.ok(existsSync(entry), `Missing ${agent}/skills/${name}`);
            checkSkillLink(entry, canonical);
        }
    });

    test(`${name} has a discoverable name and task trigger`, () => {
        checkSkillMetadata(read(`skills/${name}/SKILL.md`), name);
    });
}

test("shared policy and skill references resolve inside the repository", () => {
    const files = [resolve(root, "AGENTS.md")];
    const directories = [resolve(root, "skills")];
    while (directories.length > 0) {
        const directory = directories.pop();
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const path = resolve(directory, entry.name);
            if (entry.isDirectory()) directories.push(path);
            if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
        }
    }

    for (const path of files) {
        const text = readFileSync(path, "utf8");
        const label = relative(root, path);
        assert.ok(!text.includes("\u2014"), `${label}: avoid em dashes`);
        assert.doesNotMatch(text, /\/(?:home|Users|tmp)\//, `${label}: avoid machine-local paths`);
        const prose = text.replace(/```[\s\S]*?```/g, "");
        for (const [, href] of prose.matchAll(/\[[^\]\n]+\]\(([^)\s]+)\)/g)) {
            if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("/")) continue;
            const file = decodeURIComponent(href.split(/[?#]/, 1)[0]);
            if (!file) continue;
            const target = resolve(dirname(path), file);
            assert.ok(existsSync(target), `${label}: broken reference ${href}`);
            const resolved = relative(root, realpathSync(target));
            assert.ok(resolved !== ".." && !resolved.startsWith(`..${sep}`), `${label}: reference leaves repository`);
        }
    }
});
