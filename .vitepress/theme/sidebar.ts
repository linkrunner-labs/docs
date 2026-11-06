import type { DefaultTheme } from "vitepress";
import nav from "../nav.json";

/**
 * Expand nav.json into VitePress's multi-sidebar map. Every key for a tab
 * points at the same array, so each sidebar is shipped once (in this module)
 * instead of once per key in the site data inlined into every page.
 */
export function buildSidebar(): DefaultTheme.SidebarMulti {
  const sidebar: DefaultTheme.SidebarMulti = {};
  for (const [key, tab] of Object.entries(nav.sidebarKeys)) {
    sidebar[key] = nav.sidebars[tab] as DefaultTheme.SidebarItem[];
  }
  return sidebar;
}
