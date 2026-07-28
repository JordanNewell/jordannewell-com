// Cloudflare Worker — GitHub activity proxy for jordannewell.com.
// Solves two problems at once:
//   1. Production CSP blocks connect-src to api.github.com (same-origin bypass).
//   2. GitHub unauthenticated rate limit (60/hr per IP) — PAT bumps to 5000/hr,
//      and caching collapses N visitor requests into 1 upstream call per TTL window.
//
// Deploy:
//   cd workers/activity-proxy
//   npx wrangler secret put GH_TOKEN   # fine-grained or classic PAT with public_repo
//   npx wrangler deploy

const USER = "JordanNewell";
const EVENTS_URL = `https://api.github.com/users/${USER}/events/public`;
const CACHE_TTL_SECONDS = 60;
const USER_AGENT = "jordannewell-com-activity-proxy/1.0";

export default {
  async fetch(request, env, ctx) {
    const cacheKey = new Request(request.url, { method: "GET" });
    const cache = caches.default;

    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    try {
      const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
      };
      if (env.GH_TOKEN) headers.Authorization = `Bearer ${env.GH_TOKEN}`;

      const upstream = await fetch(EVENTS_URL, { headers });
      const status = upstream.status;

      if (status === 403 || status === 429) {
        return json({ error: "upstream-rate-limited", status }, 503, 30);
      }
      if (!upstream.ok) {
        return json({ error: "upstream-error", status }, 502, 30);
      }

      const events = await upstream.json();
      const payload = parseEvents(events);

      const remaining = upstream.headers.get("x-ratelimit-remaining") ?? "?";
      const resetEpoch = Number(upstream.headers.get("x-ratelimit-reset") ?? 0);

      const body = json({
        ok: true,
        cached_at: Date.now(),
        rate_limit: { remaining, reset_epoch: resetEpoch || null },
        ...payload,
      }, 200, CACHE_TTL_SECONDS);

      ctx.waitUntil(cache.put(cacheKey, body.clone()));
      return body;
    } catch (err) {
      return json({ error: "proxy-error", message: String(err.message || err) }, 500, 15);
    }
  },
};

function parseEvents(events) {
  const commits = [];
  const releases = [];
  const seenCommit = new Set();
  const seenRelease = new Set();

  for (const ev of events || []) {
    if (ev.type === "PushEvent" && commits.length < 10) {
      const repo = (ev.repo?.name || "").replace(/^JordanNewell\//, "") || "?";
      const head = ev.payload?.head;
      const ref = String(ev.payload?.ref || "").replace(/^refs\/(heads|tags)\//, "");
      if (!head) continue;
      const key = `${repo}:${head}`;
      if (seenCommit.has(key)) continue;
      seenCommit.add(key);
      // GitHub's public events endpoint strips payload.commits even with auth.
      // Branch ref is the best signal we can get without per-commit follow-up calls.
      commits.push({
        sha: head.slice(0, 7),
        repo,
        message: ref ? `→ ${ref}` : "",
        url: `https://github.com/JordanNewell/${repo}/commit/${head}`,
        time: ev.created_at,
      });
    } else if (ev.type === "ReleaseEvent" && releases.length < 2) {
      const repo = (ev.repo?.name || "").replace(/^JordanNewell\//, "") || "?";
      const tag = ev.payload?.release?.tag_name;
      const key = `${repo}:${tag}`;
      if (tag && !seenRelease.has(key)) {
        seenRelease.add(key);
        releases.push({
          tag,
          repo,
          url: ev.payload?.release?.html_url,
          time: ev.created_at,
        });
      }
    }
  }
  return { commits, releases };
}

function json(obj, status, maxAge) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
      "access-control-allow-origin": "https://jordannewell.com",
      "access-control-allow-methods": "GET",
    },
  });
}
