import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const baseRef = process.argv[2] ?? "origin/main";

function readBaseConfig(ref) {
    try {
        return JSON.parse(
            execFileSync("git", ["show", `${ref}:docs.json`], {
                encoding: "utf8"
            })
        );
    } catch {
        console.error(`Could not read docs.json from ${ref}.`);
        process.exit(1);
    }
}

function collectPages(node, pages = []) {
    if (Array.isArray(node)) {
        for (const item of node) {
            if (typeof item === "string") {
                pages.push(item);
            } else {
                collectPages(item, pages);
            }
        }
        return pages;
    }

    if (!node || typeof node !== "object") {
        return pages;
    }

    if (Array.isArray(node.pages)) {
        collectPages(node.pages, pages);
    }

    for (const key of [
        "tabs",
        "groups",
        "anchors",
        "dropdowns",
        "versions",
        "languages",
        "menu"
    ]) {
        if (Array.isArray(node[key])) {
            for (const item of node[key]) {
                collectPages(item, pages);
            }
        }
    }

    return pages;
}

function pageFileExists(route) {
    return existsSync(`${route}.mdx`) || existsSync(`${route}.md`);
}

const currentConfig = JSON.parse(readFileSync("docs.json", "utf8"));
const baseConfig = readBaseConfig(baseRef);
const currentPages = collectPages(currentConfig.navigation);
const basePages = collectPages(baseConfig.navigation);
const currentPageSet = new Set(currentPages);
const redirects = currentConfig.redirects ?? [];
const redirectSources = new Set(
    redirects.map(({ source }) => source.replace(/^\/+/, ""))
);

const errors = [];
const duplicatePages = [
    ...new Set(
        currentPages.filter((page, index) => currentPages.indexOf(page) !== index)
    )
];

for (const page of duplicatePages) {
    errors.push(`Navigation includes "${page}" more than once.`);
}

for (const page of currentPageSet) {
    if (!pageFileExists(page)) {
        errors.push(`Navigation page "${page}" has no matching .md or .mdx file.`);
    }
}

for (const oldPage of new Set(basePages)) {
    if (
        !currentPageSet.has(oldPage) &&
        !pageFileExists(oldPage) &&
        !redirectSources.has(oldPage)
    ) {
        errors.push(
            `Published route "/${oldPage}" was removed without a redirect in docs.json.`
        );
    }
}

for (const { source, destination } of redirects) {
    if (/^[a-z]+:\/\//i.test(destination)) {
        continue;
    }

    const destinationRoute = destination
        .replace(/^\/+/, "")
        .split(/[?#]/, 1)[0];

    if (
        destinationRoute &&
        !currentPageSet.has(destinationRoute) &&
        !pageFileExists(destinationRoute) &&
        !redirectSources.has(destinationRoute)
    ) {
        errors.push(
            `Redirect "${source}" points to missing route "${destination}".`
        );
    }
}

if (errors.length > 0) {
    console.error("Documentation route validation failed:\n");
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(
    `Documentation routes are valid: ${currentPageSet.size} pages, no unredirected removals.`
);
