// Pages Function — POST /contact
// Env bindings (set in CF Pages dashboard, never in code):
//   TURNSTILE_SECRET      — Cloudflare Turnstile secret key
//   CONTACT_WEBHOOK_URL   — generic webhook receiver (Discord-compatible)

const MAX_BODY_BYTES = 64 * 1024;
const MAX_MESSAGE_CHARS = 4000;

interface ContactPayload {
  name: string;
  replyTo: string;
  message: string;
  website: string;
  turnstileToken: string;
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function verifyTurnstile(
  secret: string,
  token: string,
  ip: string | null
): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const result = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (result.success !== true) {
      console.error("turnstile siteverify failed:", JSON.stringify(result["error-codes"] ?? []));
    }
    return result.success === true;
  } catch {
    return false;
  }
}

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const e = env as Record<string, string | undefined>;

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    return json({ ok: false, error: "expected json" }, 415);
  }

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "body too large" }, 413);
  }

  let payload: Partial<ContactPayload>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "body too large" }, 413);
    }
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad json" }, 400);
  }

  const name = (payload.name || "").toString().slice(0, 200);
  const replyTo = (payload.replyTo || "").toString().trim();
  const message = (payload.message || "").toString();
  const honeypot = (payload.website || "").toString();
  const turnstileToken = (payload.turnstileToken || "").toString();

  // Honeypot filled → bot. Fake success so it doesn't retry.
  if (honeypot) {
    return json({ ok: true }, 202);
  }

  // Basic email shape check — the address only feeds a webhook reply-to.
  if (!replyTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) {
    return json({ ok: false, error: "valid reply-to required" }, 400);
  }
  if (!message.trim() || message.length > MAX_MESSAGE_CHARS) {
    return json({ ok: false, error: "message required, max 4000 chars" }, 400);
  }

  // Turnstile: verify when a secret is bound. Without a secret the endpoint
  // stays usable pre-config, but a bound secret makes the check mandatory.
  if (e.TURNSTILE_SECRET) {
    if (!turnstileToken) {
      return json({ ok: false, error: "verification missing" }, 403);
    }
    const ip = request.headers.get("CF-Connecting-IP");
    const human = await verifyTurnstile(e.TURNSTILE_SECRET, turnstileToken, ip);
    if (!human) {
      return json({ ok: false, error: "verification failed" }, 403);
    }
  }

  const ua = request.headers.get("User-Agent") || "";
  const entry = { name, replyTo, message, ua, ts: new Date().toISOString() };

  if (e.CONTACT_WEBHOOK_URL) {
    const isDiscord = e.CONTACT_WEBHOOK_URL.includes("discord.com/api/webhooks");
    const body = isDiscord
      ? {
          content: [
            "**contact — jordannewell.com**",
            name ? `name: ${name}` : null,
            `reply-to: ${replyTo}`,
            `ua: ${ua}`,
            `ts: ${entry.ts}`,
            "",
            message,
          ]
            .filter((line) => line !== null)
            .join("\n"),
        }
      : entry;
    try {
      await fetch(e.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      // Accepted regardless — delivery is best-effort, never blocks the sender.
      console.error("contact webhook delivery failed:", err);
    }
  } else {
    console.log("contact (no webhook bound):", JSON.stringify(entry));
  }

  return json({ ok: true }, 202);
};
