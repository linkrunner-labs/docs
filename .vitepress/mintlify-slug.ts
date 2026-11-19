/**
 * Anchor ids the way docs.linkrunner.io (Mintlify) makes them, so links
 * shared from the Mintlify site land on the same section here.
 *
 * Ported from Mintlify's renderer (mint 0.0.3904: @mintlify/common slugify,
 * remarkComponentIds, and its copy of @sindresorhus/slugify) and checked
 * against every anchor on the live site (scripts/legacy-urls.json,
 * scripts/check-legacy-urls.ts):
 * - headings (levels 1 to 4): lowercase, spaces to "-", percent-encode, slugify
 *   keeping "%" and "_", then decode and drop `?,;:!'"()[]{}`. So
 *   "1. Open Create Link" -> "1-open-create-link", "What You'll Get" ->
 *   "what-you’ll-get" (Mintlify curls quotes first), "Step 2: Ad Group & Ads"
 *   -> "step-2-ad-group-&-ads". Repeats get "-2", "-3".
 * - accordions: plain slugify of the title ("&" -> "and"); repeats get "-1".
 * - tabs: like headings but left percent-encoded ("iOS / Android" ->
 *   "ios-%2F-android"), with their own counter per page.
 */

// Only the replacements that matter for ASCII titles; the full Mintlify table
// also transliterates symbols and non-Latin letters (diacritics are handled).
const BUILTIN_REPLACEMENTS: [string, string][] = [
  ["&", " and "],
  ["🦄", " unicorn "],
  ["♥", " love "],
];

const escapeRe = (s: string) => s.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");

type SlugOpts = { lowercase?: boolean; preserve?: string[]; replacements?: boolean };

/** @sindresorhus/slugify with decamelize off, as Mintlify calls it. */
function sindreSlugify(input: string, { lowercase = true, preserve = [], replacements = true }: SlugOpts = {}): string {
  let s = input.normalize();
  if (replacements) for (const [from, to] of BUILTIN_REPLACEMENTS) s = s.split(from).join(to);
  s = s.normalize("NFD").replace(/\p{Diacritic}/gu, "").normalize();
  const keep = "a-z\\d" + (lowercase ? "" : "A-Z") + preserve.map(escapeRe).join("");
  if (lowercase) s = s.toLowerCase();
  s = s
    .replace(new RegExp(`[^${keep}]+`, "g"), "-")
    .replace(/\\/g, "")
    .replace(/([a-zA-Z\d]+)-([ts])(-|$)/g, "$1$2$3");
  return s.replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
}

/** Mintlify's `slugify`: percent-encoded unless the title is plain ASCII. */
function encodedSlug(text: string): string {
  const id = encodeURIComponent(text.toLowerCase().trim().replace(/\s+/g, "-"));
  return /%[0-9A-F]{2}/.test(id)
    ? sindreSlugify(id, { lowercase: false, preserve: ["%", "_"] })
    : sindreSlugify(id, { preserve: ["_"] });
}

/** Mintlify's `cachedSlugifyWithCounter`: repeats get "-2", "-3", ... */
export function slugCounter() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    let slug = encodedSlug(text);
    if (!slug) return "";
    const key = slug.toLowerCase();
    const base = seen.get(key.replace(/(?:-\d+?)+?$/, "")) || 0;
    seen.set(key, (seen.get(key) ?? 0) + 1);
    const n = seen.get(key) || 2;
    if (n >= 2 || base > 2) slug = `${slug}-${n}`;
    return slug;
  };
}

/** Mintlify's `safeCleanHeadingId`: decode, drop punctuation and emoji. */
export function cleanHeadingId(id: string): string {
  try {
    return decodeURIComponent(id.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"))
      .replace(/[?,;:!'"()[\]{}]/g, "")
      .replace(/\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Presentation}|\p{Extended_Pictographic}|\u200d|\ufe0e|\ufe0f/gu, "");
  } catch {
    return id;
  }
}

/** Mintlify's slug deduplicator, applied to the cleaned heading ids. */
export function slugClaimer() {
  const used = new Map<string, number>();
  return (slug: string): string => {
    const n = used.get(slug) ?? 0;
    used.set(slug, n + 1);
    if (n === 0) return slug;
    let i = n + 1;
    let out = `${slug}-${i}`;
    while (used.has(out)) out = `${slug}-${++i}`;
    used.set(out, 1);
    return out;
  };
}

/**
 * Mintlify runs smartypants over heading text before it makes the id, so
 * straight quotes in the source become curly ones in the anchor.
 */
export function smartQuotes(text: string): string {
  return text
    .replace(/\.\.\./g, "…")
    .replace(/(^|[\s([{\-—–])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s([{\-—–])'(?=[A-Za-z])/g, "$1‘")
    .replace(/'/g, "’");
}

/** Per-page heading id generator: `next("1. Open Create Link")`. */
export function headingIds() {
  const count = slugCounter();
  const claim = slugClaimer();
  return (text: string) => claim(cleanHeadingId(count(text)));
}

/** Per-page <Accordion title="..."> id generator; repeats get "-1", "-2". */
export function accordionIds() {
  const seen = new Map<string, number>();
  return (title: string) => {
    const id = sindreSlugify(title.replace(":", "-"));
    const n = seen.get(id) ?? 0;
    seen.set(id, n + 1);
    return n > 0 ? `${id}-${n}` : id;
  };
}

/** Per-page tab id generator (<Tab title="...">), left percent-encoded. */
export function tabIds() {
  const count = slugCounter();
  const used = new Set<string>();
  return (title: string) => {
    let id = count(title);
    while (used.has(id)) id = count(title);
    used.add(id);
    return id;
  };
}
