import type { DefaultTheme } from "vitepress";
import { relaySidebars, relaySidebarKeys } from "../relay-nav";

/**
 * Expand the Relay sidebars into VitePress's multi-sidebar map. Every key for a
 * tab points at the same array, so each sidebar ships once (in this module)
 * instead of once per key in the site data inlined into every page.
 */
export function buildRelaySidebar(): DefaultTheme.SidebarMulti {
  const sidebar: DefaultTheme.SidebarMulti = {};
  for (const [key, tab] of Object.entries(relaySidebarKeys)) {
    sidebar[key] = relaySidebars[tab] as DefaultTheme.SidebarItem[];
  }
  return sidebar;
}
