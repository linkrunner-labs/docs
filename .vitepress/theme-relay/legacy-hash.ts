/**
 * Land section links on the right spot, including ones shared from
 * docs.linkrunner.io (Mintlify) before the move:
 * - an anchor this page renamed (RELAY_ANCHOR_ALIASES in relay-content.ts),
 * - a Mintlify-era form of an anchor ("#step-4%3A-backup-configuration",
 *   "#_2-set-up"): matched ignoring punctuation,
 * - a section inside a closed accordion or a hidden tab: opened first.
 * Plain anchors that are already on screen are left to VitePress.
 */
import { cleanHeadingId } from "../mintlify-slug";
import { RELAY_ANCHOR_ALIASES } from "../relay-content";

const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};
const loose = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");

function findTarget(path: string, raw: string): HTMLElement | null {
  const hash = decode(raw);
  const byId = (id?: string) => (id ? document.getElementById(id) : null);
  const exact = byId(hash) ?? byId(raw) ?? byId(RELAY_ANCHOR_ALIASES[path]?.[hash]) ?? byId(cleanHeadingId(raw));
  if (exact) return exact;
  const want = loose(hash);
  if (!want) return null;
  const doc = document.querySelector(".vp-doc") ?? document;
  return [...doc.querySelectorAll<HTMLElement>("[id]")].find((el) => loose(el.id) === want) ?? null;
}

/** Open closed accordions and pick hidden tabs around `el`; true if any were. */
function reveal(el: HTMLElement): boolean {
  let changed = false;
  for (let d = el.closest("details"); d; d = d.parentElement?.closest("details") ?? null) {
    if (!d.open) {
      d.open = true;
      changed = true;
    }
  }
  for (let p = el.closest<HTMLElement>(".lr-tabs__panel"); p; p = p.parentElement?.closest<HTMLElement>(".lr-tabs__panel") ?? null) {
    if (p.style.display !== "none") continue;
    document.getElementById(p.getAttribute("aria-labelledby") ?? "")?.click();
    changed = true;
  }
  // A Mintlify tab anchor: an empty marker in front of its tab group.
  const tab = el.classList.contains("lr-tabs__anchor")
    ? el.parentElement?.querySelectorAll<HTMLElement>(":scope > .lr-tabs__bar > [role=tab]")[Number(el.dataset.tab)]
    : undefined;
  if (tab && tab.getAttribute("aria-selected") !== "true") {
    tab.click();
    changed = true;
  }
  return changed;
}

export function landOnHash(path: string) {
  const raw = location.hash.slice(1);
  if (!raw) return;
  const route = path.replace(/\.html$/, "").replace(/(.)\/$/, "$1");
  const el = findTarget(route, raw);
  if (!el) return;
  const renamed = el.id !== decode(raw);
  if (renamed) history.replaceState(history.state, "", location.pathname + location.search + "#" + el.id);
  // Picking a tab can switch other tab groups above it (they follow the same
  // choice), which moves the target after the browser scrolled to it.
  const inTabs = !!el.closest(".lr-tabs");
  if (!reveal(el) && !renamed && !inTabs) return;
  // Wait for Vue to show the opened tab before measuring.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const nav = document.querySelector(".VPNav")?.getBoundingClientRect().height ?? 64;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - nav - 24 });
    })
  );
}
