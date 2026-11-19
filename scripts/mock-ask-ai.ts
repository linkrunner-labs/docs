/**
 * Local mock of the docs Ask AI API (LIN-4511 contract) for UI work. Not
 * shipped; the real backend is support-chat-agent.
 *
 * Run:   bun run scripts/mock-ask-ai.ts            (port 3199, or MOCK_PORT)
 * Build: VITE_ASK_AI_API=http://<host>:3199/api/docs-ai bun run build:relay
 *
 * Put a trigger word in the question to test an error path:
 *   test:429      chat returns 429 rate_limited (retryAfterSeconds 540)
 *   test:503      chat returns 503 busy
 *   test:401      first try returns 401; the client gets a new session and retries
 *   test:401x     always 401 (client gives up after one retry)
 *   test:midbusy  stream starts, then sends event: error { code: "busy" }
 *   test:network  connection drops mid-stream
 *   test:xss      answer with <script>, javascript: links and an image
 *   test:slow     slow stream (to test Stop)
 *   test:noanswer done { answered: false } (so does an off-topic question,
 *                 e.g. one about the weather, a recipe or a poem)
 * Feedback: POST /api/docs-ai/feedback { questionId, rating } is logged; an
 * unknown questionId gets 404 (the UI ignores failures).
 * MOCK_SESSION makes the session endpoint fail instead:
 *   429 rate_limited, 503 unavailable, 403 unavailable (visitor IP unreadable).
 */

const PORT = Number(process.env.MOCK_PORT || 3199);
const SESSION_FAIL = process.env.MOCK_SESSION;
const DOCS = "https://docs.v2.linkrunner.io";

const sessions = new Map<string, number>(); // token -> expiry
const failed401 = new Map<string, string>(); // question -> token that got the 401
const questions = new Map<string, string>(); // questionId -> session token

const cors = (req: Request) => ({
  "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  Vary: "Origin",
});

const json = (req: Request, status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors(req) } });
const fail = (req: Request, status: number, code: string, message: string, retryAfterSeconds?: number) =>
  json(req, status, { error: { code, message, ...(retryAfterSeconds ? { retryAfterSeconds } : {}) } });

const ANSWER = `To set up deep links in Flutter, install the SDK, initialise it once at app start, and read the deep link from the init response.

1. Add the package:

\`\`\`bash
flutter pub add linkrunner
\`\`\`

2. Initialise it in \`main()\`:

\`\`\`dart
await LinkRunner().init("YOUR_PROJECT_TOKEN");
final data = await LinkRunner().getAttributionData();
print(data.deeplink);
\`\`\`

3. Configure **Android App Links** and **iOS Universal Links** in your project. See [Deep linking setup](${DOCS}/features/deep-linking-setup) and the [Flutter SDK guide](${DOCS}/sdk/flutter).

| Platform | File |
| --- | --- |
| Android | \`AndroidManifest.xml\` |
| iOS | \`Runner.entitlements\` |

You can check the result in the [Linkrunner dashboard](https://dashboard.linkrunner.io/) under Campaigns.`;

const XSS = `Here is some tricky output that must render as text:

<script>alert(1)</script>

<img src=x onerror="alert(2)">

[x](javascript:alert(1)) and [y](JAVASCRIPT:alert(1)) and [z](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==) and <javascript:alert(3)>

![tracker](https://example.com/pixel.png)

A safe link: [Deep linking](${DOCS}/features/deep-linking-setup) and an external one: [Linkrunner](https://linkrunner.io).`;

const SOURCES = [
  { title: "Deep linking setup", url: `${DOCS}/features/deep-linking-setup` },
  { title: "Flutter SDK", url: `${DOCS}/sdk/flutter` },
  { title: "Testing attribution", url: `${DOCS}/features/testing-attribution` },
];

function chunks(text: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length; ) {
    const n = 3 + Math.floor(Math.random() * 10);
    out.push(text.slice(i, i + n));
    i += n;
  }
  return out;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Page = { path?: string; title?: string; section?: string; selection?: string };

// Echo the page context the client sent, so the UI can be checked end to end.
function echo(page: Page | string | undefined): string {
  if (!page) return "_Page context: none._\n\n";
  if (typeof page === "string") return `_Page context (old string shape): ${page}_\n\n`;
  const q = (s?: string) => (s ? JSON.stringify(s) : "none");
  return (
    `> **Page context received.** path: \`${page.path ?? "none"}\`, title: ${q(page.title)}, ` +
    `section: ${q(page.section)}, selection: ${q(page.selection)}\n\n`
  );
}

const OFF_TOPIC = `I can only answer questions about Linkrunner, and the docs don't cover this. Try search, or ask about setting up or using Linkrunner.`;

function stream(req: Request, question: string, page?: Page | string, token = ""): Response {
  const questionId = crypto.randomUUID();
  questions.set(questionId, token);
  const enc = new TextEncoder();
  const q = question.toLowerCase();
  const offTopic = q.includes("test:noanswer") || /weather|recipe|poem/.test(q);
  const send = (c: ReadableStreamDefaultController, event: string, data: unknown) =>
    c.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
  const body = new ReadableStream({
    async start(c) {
      try {
        await sleep(600);
        send(c, "sources", { sources: q.includes("test:xss") ? [...SOURCES, { title: "Bad", url: "javascript:alert(1)" }] : SOURCES });
        await sleep(400);
        const text = echo(page) + (q.includes("test:xss") ? XSS : offTopic ? OFF_TOPIC : ANSWER);
        const delay = q.includes("test:slow") ? 120 : 25;
        let i = 0;
        for (const part of chunks(text)) {
          if (req.signal.aborted) return;
          send(c, "delta", { text: part });
          await sleep(delay);
          if (q.includes("test:midbusy") && ++i === 20) {
            send(c, "error", { code: "busy", message: "Daily budget reached" });
            c.close();
            return;
          }
          if (q.includes("test:network") && ++i === 20) {
            c.error(new Error("dropped"));
            return;
          }
        }
        send(c, "done", { answered: !offTopic, questionId });
        c.close();
      } catch {
        try {
          c.close();
        } catch {
          // Already closed.
        }
      }
    },
  });
  return new Response(body, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", ...cors(req) },
  });
}

Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  idleTimeout: 60,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
    if (req.method !== "POST") return fail(req, 404, "not_found", "Not found");

    if (url.pathname === "/api/docs-ai/session") {
      console.log("session");
      if (SESSION_FAIL === "429") return fail(req, 429, "rate_limited", "Too many sessions", 300);
      if (SESSION_FAIL === "503") return fail(req, 503, "unavailable", "Not configured");
      if (SESSION_FAIL === "403") return fail(req, 403, "unavailable", "Can't resolve client IP");
      const token = `mock.${crypto.randomUUID()}`;
      const exp = Date.now() + 30 * 60_000;
      sessions.set(token, exp);
      return json(req, 200, { sessionToken: token, expiresAt: new Date(exp).toISOString() });
    }

    if (url.pathname === "/api/docs-ai/chat") {
      const token = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
      const body = (await req.json().catch(() => null)) as {
        messages?: { role: string; content: string }[];
        page?: Page | string;
      } | null;
      const msgs = body?.messages || [];
      const last = msgs[msgs.length - 1];
      console.log(`chat     messages=${msgs.length} page=${JSON.stringify(body?.page)} q=${JSON.stringify(last?.content?.slice(0, 60))}`);
      if (!sessions.has(token) || sessions.get(token)! < Date.now())
        return fail(req, 401, "session_expired", "Session expired");
      if (!last || last.role !== "user" || last.content.length > 1000)
        return fail(req, 400, "invalid_request", "Bad messages");
      const q = last.content.toLowerCase();
      if (q.includes("test:401x")) return fail(req, 401, "session_expired", "Session expired");
      if (q.includes("test:401")) {
        const seen = failed401.get(last.content);
        if (!seen || seen === token) {
          failed401.set(last.content, token);
          sessions.delete(token);
          return fail(req, 401, "session_expired", "Session expired");
        }
      }
      if (q.includes("test:429")) return fail(req, 429, "rate_limited", "Too many questions", 540);
      if (q.includes("test:503")) return fail(req, 503, "busy", "Daily cap reached");
      return stream(req, last.content, body?.page, token);
    }
    if (url.pathname === "/api/docs-ai/feedback") {
      const token = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
      const body = (await req.json().catch(() => null)) as { questionId?: string; rating?: number } | null;
      console.log(`feedback questionId=${body?.questionId} rating=${body?.rating}`);
      if (!sessions.has(token)) return fail(req, 401, "session_expired", "Session expired");
      if (!body?.questionId || (body.rating !== 1 && body.rating !== -1))
        return fail(req, 400, "invalid_request", "Bad feedback");
      if (questions.get(body.questionId) !== token) return fail(req, 404, "not_found", "Unknown question");
      return json(req, 200, { ok: true });
    }
    return fail(req, 404, "not_found", "Not found");
  },
});

console.log(`Mock Ask AI API on http://0.0.0.0:${PORT}`);
