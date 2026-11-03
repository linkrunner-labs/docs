/**
 * Which address this build is for (LIN-4601). False: the docs.v2 preview,
 * kept out of search engines. True: the main docs at docs.linkrunner.io, which
 * switches every absolute URL (share cards, canonical links, llms.txt, the
 * sitemap, the page Markdown), drops the robots noindex meta and the "Docs v2
 * preview" footer. Flip it in the same change that removes the X-Robots-Tag
 * header from firebase.json (scripts/check-agent-files.ts checks both agree).
 */
export const MAIN_SITE = true;

export const MAIN_URL = "https://docs.linkrunner.io";
export const PREVIEW_URL = "https://docs.v2.linkrunner.io";
export const SITE_URL = MAIN_SITE ? MAIN_URL : PREVIEW_URL;
