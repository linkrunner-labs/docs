// Ask AI settings, read at build time from Vite env vars.
//
//   VITE_ASK_AI_ENABLED=false     switch the feature off (no button, no code loaded)
//   VITE_ASK_AI_API=<url>         backend base URL (ts-backend); set it empty to
//                                 switch off too. Default https://api.linkrunner.io/api/docs-ai

const env = import.meta.env as Record<string, string | undefined>;

const DEFAULT_API = "https://api.linkrunner.io/api/docs-ai";

const api = (env.VITE_ASK_AI_API ?? DEFAULT_API).trim().replace(/\/+$/, "");

export const ASK_AI_API = api;
export const ASK_AI_ENABLED = env.VITE_ASK_AI_ENABLED !== "false" && api !== "";

/** Hosts whose links open in place with the VitePress router. */
export function sameSiteHosts(): string[] {
  const hosts = ["docs.linkrunner.io", "docs.v2.linkrunner.io"];
  if (typeof location !== "undefined") hosts.push(location.host);
  return hosts;
}

export const MAX_QUESTION_CHARS = 1000;
export const MAX_MESSAGES = 12;
