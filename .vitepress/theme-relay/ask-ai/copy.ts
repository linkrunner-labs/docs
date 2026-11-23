/** Copy text, with a fallback for plain-http previews that lack the async clipboard. */
export async function copyText(value: string): Promise<void> {
  if (window.isSecureContext && navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const back = document.activeElement as HTMLElement | null;
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.append(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  back?.focus({ preventScroll: true });
  if (!ok) throw new Error("copy failed");
}
