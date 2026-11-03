import { ASK_AI_API, MAX_MESSAGES } from "./config";

// Client for the docs Ask AI API (LIN-4511):
//   POST {base}/session  {} -> { sessionToken, expiresAt }
//   POST {base}/chat     { messages, page: { path, title?, section?, selection? } }
//                        -> text/event-stream
//     events: sources { sources: [{ title, url }] }, delta { text },
//             done { answered, questionId }, error { code: "busy" | "failed", message }
//   POST {base}/feedback { questionId, rating: 1 | -1 } -> { ok: true }

export type Source = { title: string; url: string };

/** A stream event's JSON, before its fields are checked. */
type Payload = {
  sources?: unknown;
  text?: unknown;
  answered?: unknown;
  questionId?: unknown;
  code?: unknown;
  message?: unknown;
} | null;
export type ChatMessage = { role: "user" | "assistant"; content: string };
/** What the reader is looking at (contract section C). */
export type PageContext = { path: string; title?: string; section?: string; selection?: string };

export type AskErrorKind =
  | "rate_limited"
  | "busy"
  | "unavailable"
  | "network"
  | "invalid"
  | "failed";
export class AskError extends Error {
  constructor(
    public kind: AskErrorKind,
    message: string,
    public retryAfterSeconds?: number
  ) {
    super(message);
  }
}

type Session = { token: string; expiresAt: number };
// Kept in sessionStorage (this tab only, gone when it closes) so a reload or
// a full page load doesn't run the Cloudflare check again. The token is
// short-lived (30 minutes) and the server binds it to the visitor's IP.
const SESSION_KEY = "lr-ask-session";
let session: Session | null = loadSession();

function loadSession(): Session | null {
  try {
    const raw = typeof sessionStorage === "undefined" ? null : sessionStorage.getItem(SESSION_KEY);
    const s = raw ? (JSON.parse(raw) as Session) : null;
    // Anything odd (edited storage, a future expiry the server never issues)
    // is dropped, so a bad entry can't lock the tab out.
    if (
      s &&
      typeof s.token === "string" &&
      /^[A-Za-z0-9._~+/=-]{1,512}$/.test(s.token) &&
      typeof s.expiresAt === "number" &&
      s.expiresAt > Date.now() &&
      s.expiresAt < Date.now() + 31 * 60_000
    )
      return s;
  } catch {
    // Storage blocked or bad JSON: start a new session.
  }
  return null;
}
function saveSession(s: Session | null) {
  session = s;
  try {
    if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage blocked (private mode): the session lives in memory only.
  }
}

type ApiError = { error?: { code?: string; message?: string; retryAfterSeconds?: number } };

async function readError(res: Response): Promise<AskError> {
  let body: ApiError = {};
  try {
    body = await res.json();
  } catch {
    // Not JSON: fall back to the status code below.
  }
  const code = body.error?.code;
  const msg = body.error?.message || `Request failed (${res.status})`;
  const header = Number(res.headers.get("retry-after"));
  const retry = body.error?.retryAfterSeconds ?? (Number.isFinite(header) && header > 0 ? header : undefined);
  // The code decides; the status is only a fallback. The session route sends
  // "unavailable" with 403 (visitor IP unreadable), 503 or 404 (switched off).
  switch (code) {
    case "rate_limited":
      return new AskError("rate_limited", msg, retry);
    case "busy":
      return new AskError("busy", msg);
    case "unavailable":
      return new AskError("unavailable", msg);
    case "invalid_request":
      return new AskError("invalid", msg);
  }
  if (res.status === 429) return new AskError("rate_limited", msg, retry);
  if (res.status === 503 || res.status === 403) return new AskError("unavailable", msg);
  if (res.status === 400) return new AskError("invalid", msg);
  return new AskError("failed", msg);
}

async function post(path: string, body: unknown, signal: AbortSignal, token?: string): Promise<Response> {
  try {
    return await fetch(`${ASK_AI_API}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
      credentials: "omit",
      cache: "no-store",
    });
  } catch (e) {
    if (signal.aborted) throw e;
    throw new AskError("network", "Couldn't reach Ask AI.");
  }
}

async function newSession(signal: AbortSignal): Promise<Session> {
  const res = await post("/session", {}, signal);
  if (!res.ok) throw await readError(res);
  const data = (await res.json()) as { sessionToken: string; expiresAt: string };
  const s = { token: data.sessionToken, expiresAt: Date.parse(data.expiresAt) || Date.now() + 25 * 60_000 };
  saveSession(s);
  return s;
}

async function currentSession(signal: AbortSignal): Promise<Session> {
  // Renew a minute early so a long answer doesn't outlive the session.
  if (session && session.expiresAt - Date.now() > 60_000) return session;
  return newSession(signal);
}

export type StreamHandlers = {
  onSources(sources: Source[]): void;
  onDelta(text: string): void;
  onDone(answered: boolean, questionId?: string): void;
};

/** Ask a question and stream the answer. Retries once with a new session on 401. */
export async function ask(
  messages: ChatMessage[],
  page: PageContext | undefined,
  signal: AbortSignal,
  handlers: StreamHandlers
): Promise<void> {
  const body = { messages: messages.slice(-MAX_MESSAGES), page };
  let s = await currentSession(signal);
  let res = await post("/chat", body, signal, s.token);
  if (res.status === 401) {
    saveSession(null);
    s = await newSession(signal);
    res = await post("/chat", body, signal, s.token);
    if (res.status === 401) {
      saveSession(null);
      throw new AskError("failed", "Your session expired.");
    }
  }
  if (!res.ok) throw await readError(res);
  if (!res.body) throw new AskError("network", "No response body.");
  await readStream(res.body, signal, handlers);
}

async function readStream(body: ReadableStream<Uint8Array>, signal: AbortSignal, h: StreamHandlers) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;

  const handle = (event: string, data: string) => {
    // Shape checked field by field below; anything unexpected is ignored.
    let payload: Payload;
    try {
      payload = JSON.parse(data) as Payload;
    } catch {
      return;
    }
    if (event === "sources" && Array.isArray(payload?.sources)) {
      h.onSources(
        payload.sources
          .filter(
            (s: unknown): s is Source => {
              const v = s as { title?: unknown; url?: unknown } | null;
              return !!v && typeof v.title === "string" && typeof v.url === "string" && /^(https?:\/\/|\/(?!\/))/i.test(v.url);
            }
          )
          .slice(0, 8)
      );
    } else if (event === "delta" && typeof payload?.text === "string") {
      h.onDelta(payload.text);
    } else if (event === "done") {
      finished = true;
      h.onDone(
        payload?.answered !== false,
        typeof payload?.questionId === "string" ? payload.questionId.slice(0, 64) : undefined
      );
    } else if (event === "error") {
      finished = true;
      const message = typeof payload?.message === "string" ? payload.message : "";
      throw payload?.code === "busy"
        ? new AskError("busy", message || "Busy")
        : new AskError("failed", message || "The answer stopped early.");
    }
  };

  const flush = (block: string) => {
    let event = "message";
    const data: string[] = [];
    for (const line of block.split("\n")) {
      if (line.startsWith(":")) continue;
      const i = line.indexOf(":");
      const field = i === -1 ? line : line.slice(0, i);
      const value = i === -1 ? "" : line.slice(i + 1).replace(/^ /, "");
      if (field === "event") event = value;
      else if (field === "data") data.push(value);
    }
    if (data.length) handle(event, data.join("\n"));
  };

  try {
    while (true) {
      let chunk: Awaited<ReturnType<typeof reader.read>>;
      try {
        chunk = await reader.read();
      } catch (e) {
        if (signal.aborted) throw e;
        throw new AskError("network", "The connection dropped.");
      }
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true }).replace(/\r\n?/g, "\n");
      let at: number;
      while ((at = buffer.indexOf("\n\n")) !== -1) {
        const block = buffer.slice(0, at);
        buffer = buffer.slice(at + 2);
        flush(block);
        if (finished) return;
      }
    }
    if (buffer.trim()) flush(buffer);
    if (!finished) throw new AskError("network", "The connection dropped.");
  } finally {
    reader.cancel().catch(() => {});
  }
}

/**
 * Rate an answer (1 helpful, -1 not helpful). Uses the session the answer was
 * asked in; the server ties the rating to it. Failures are silent: feedback
 * must never get in the reader's way.
 */
export async function sendFeedback(questionId: string, rating: 1 | -1): Promise<void> {
  if (!session || session.expiresAt <= Date.now()) return;
  try {
    await fetch(`${ASK_AI_API}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ questionId, rating }),
      credentials: "omit",
      cache: "no-store",
      keepalive: true,
    });
  } catch {
    // Feedback is best effort; never interrupt the reader.
  }
}
