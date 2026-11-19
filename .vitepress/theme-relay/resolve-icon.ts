import { icons } from "./icons";
import { PHOSPHOR, BRANDS } from "./icon-map";

/** Logo paths (`/images/logos/meta.webp`) are shown as images, not glyphs. */
export function isIconPath(name: string): boolean {
  return /^(\/|https?:)/.test(name) || /\.(svg|png|webp|jpe?g)$/i.test(name);
}

/** Mintlify Font Awesome name -> bundled Phosphor (or brand) glyph. */
export function iconSvg(name: string): { viewBox: string; body: string } | null {
  const n = name.trim().replace(/^fa[a-z]?-/, "");
  return icons[BRANDS.includes(n) ? `brand:${n}` : PHOSPHOR[n] ?? n] ?? null;
}
