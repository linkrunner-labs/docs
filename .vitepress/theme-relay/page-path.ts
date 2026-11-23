import type { DefaultTheme } from "vitepress";

/** "sdk/flutter.md" -> "/sdk/flutter", "index.md" -> "/". */
export function pagePath(relativePath: string): string {
  const p = "/" + relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");
  return p.length > 1 ? p.replace(/\/$/, "") : p;
}

/** A sidebar label without its icon markup. */
export const plainText = (html: string) => html.replace(/<[^>]*>/g, "").trim();

/** Top-level sidebar group that contains `path`, searching nested items. */
export function findGroup(
  groups: DefaultTheme.SidebarItem[],
  path: string
): DefaultTheme.SidebarItem | undefined {
  const norm = (l: string) => l.replace(/\/$/, "") || "/";
  const has = (items: DefaultTheme.SidebarItem[] = []): boolean =>
    items.some((it) => (it.link && norm(it.link) === path) || has(it.items));
  return groups.find((g) => has(g.items));
}
