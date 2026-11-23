// What the reader is looking at, sent with each question (contract section C).

const MAX = 200;
export const clip = (s: string | undefined, n = MAX) => (s ? s.replace(/\s+/g, " ").trim().slice(0, n) : "");

function headingText(h: Element): string {
  const copy = h.cloneNode(true) as Element;
  copy.querySelectorAll(".header-anchor, .VPBadge").forEach((el) => el.remove());
  return clip(copy.textContent || "");
}

/**
 * The h2/h3 the reader is scrolled to: the last heading above the top of the
 * viewport (under the sticky bars), or the last one when the page is scrolled
 * to the bottom. Same rule as VitePress's "On this page" active link.
 */
const docHeadings = () =>
  [...document.querySelectorAll<HTMLElement>(".vp-doc :is(h2, h3)[id]")].filter((h) => h.offsetParent !== null);

/** The nearest h2/h3 before `node` in document order (the heading a highlight sits under). */
export function headingBefore(node: Node): string {
  let found: HTMLElement | undefined;
  for (const h of docHeadings()) {
    if (h === node || h.contains(node) || h.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) found = h;
    else break;
  }
  return found ? headingText(found) : "";
}

export function currentSection(): string {
  const headings = docHeadings();
  if (!headings.length) return "";
  // Heights, not positions: the sticky bars can scroll away while the phone
  // sheet locks page scrolling.
  const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height")) || 64;
  const localNav = document.querySelector<HTMLElement>(".VPLocalNav");
  const local = localNav && getComputedStyle(localNav).display !== "none" ? localNav.offsetHeight : 0;
  const offset = nav + local + 4;
  const atBottom = Math.abs(window.scrollY + window.innerHeight - document.documentElement.scrollHeight) < 2;
  if (atBottom && window.scrollY > 0) return headingText(headings[headings.length - 1]);
  let current: HTMLElement | undefined;
  for (const h of headings) {
    if (h.getBoundingClientRect().top <= offset) current = h;
    else break;
  }
  return current ? headingText(current) : "";
}
