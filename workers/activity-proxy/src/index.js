// Cloudflare Worker — GitHub activity proxy for jordannewell.com.
// Solves two problems at once:
//   1. Production CSP blocks connect-src to api.github.com (same-origin bypass).
//   2. GitHub unauthenticated rate limit (60/hr per IP) — PAT bumps to 5000/hr,
//      and caching collapses N visitor requests into 1 upstream call per TTL window.
//
// Two endpoints:
//   /api/activity.json      — events feed (pushes + releases), the homepage terminal.
//   /api/activity-reel.json — six most-pushed repos × eight commits each, merged
//                             newest-first, for the dev Midway's drive-in film.
//                             Same shape as the commit objects the browser used to
//                             fetch from api.github.com itself, so the page keeps
//                             one parser and an anonymous direct fallback.
//
// Deploy:
//   cd workers/activity-proxy
//   npx wrangler secret put GH_TOKEN   # fine-grained or classic PAT with public_repo
//   npx wrangler deploy

const USER = "JordanNewell";
const EVENTS_URL = `https://api.github.com/users/${USER}/events/public`;
const REPOS_URL = `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=6`;
const REEL_COMMITS_PER_REPO = 8;
const REEL_CACHE_TTL_SECONDS = 600;
const CACHE_TTL_SECONDS = 60;
const USER_AGENT = "jordannewell-com-activity-proxy/1.0";
const ALLOWED_ORIGINS = ["https://jordannewell.com", "https://dev.jordannewell.com"];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/activity-reel.json") return reel(request, env, ctx);
    return activity(request, env, ctx);
  },
};

function ghHeaders(env) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  if (env.GH_TOKEN) headers.Authorization = `Bearer ${env.GH_TOKEN}`;
  return headers;
}

function originFor(request) {
  const origin = request.headers.get("origin");
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

function json(request, obj, status, maxAge) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
      "access-control-allow-origin": originFor(request),
      "access-control-allow-methods": "GET",
    },
  });
}

async function activity(request, env, ctx) {
  const cacheKey = new Request(request.url, { method: "GET" });
  const cache = caches.default;

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const upstream = await fetch(EVENTS_URL, { headers: ghHeaders(env) });
    const status = upstream.status;

    if (status === 403 || status === 429) {
      return json(request, { error: "upstream-rate-limited", status }, 503, 30);
    }
    if (!upstream.ok) {
      return json(request, { error: "upstream-error", status }, 502, 30);
    }

    const events = await upstream.json();
    const payload = parseEvents(events);

    const remaining = upstream.headers.get("x-ratelimit-remaining") ?? "?";
    const resetEpoch = Number(upstream.headers.get("x-ratelimit-reset") ?? 0);

    const body = json(request, {
      ok: true,
      cached_at: Date.now(),
      rate_limit: { remaining, reset_epoch: resetEpoch || null },
      ...payload,
    }, 200, CACHE_TTL_SECONDS);

    ctx.waitUntil(cache.put(cacheKey, body.clone()));
    return body;
  } catch (err) {
    return json(request, { error: "proxy-error", message: String(err.message || err) }, 500, 15);
  }
}

/* The Midway's pull: six most-recently-pushed repos, eight commits each,
   merged newest-first, handed back as raw commit objects — the exact shape
   the page's collect() already parses, so the browser path stays as fallback. */
async function reel(request, env, ctx) {
  const cacheKey = new Request(request.url, { method: "GET" });
  const cache = caches.default;

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const reposRes = await fetch(REPOS_URL, { headers: ghHeaders(env) });
    if (reposRes.status === 403 || reposRes.status === 429) {
      return json(request, { error: "upstream-rate-limited", status: reposRes.status }, 503, 30);
    }
    if (!reposRes.ok) {
      return json(request, { error: "upstream-error", status: reposRes.status }, 502, 30);
    }

    const repos = await reposRes.json();
    const names = (Array.isArray(repos) ? repos : [])
      .map(function (r) { return r && r.name; })
      .filter(Boolean)
      .slice(0, 6);

    const groups = await Promise.all(names.map(async function (name) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${USER}/${encodeURIComponent(name)}/commits?per_page=${REEL_COMMITS_PER_REPO}`,
          { headers: ghHeaders(env) }
        );
        if (!res.ok) return [];
        const commits = await res.json();
        return (Array.isArray(commits) ? commits : []).map(function (c) {
          c.repository = { full_name: `${USER}/${name}` };
          return c;
        });
      } catch (err) {
        return [];
      }
    }));

    const items = [];
    groups.forEach(function (g) { items.push.apply(items, g); });
    items.sort(function (a, b) {
      return new Date((b.commit && b.commit.committer && b.commit.committer.date) || 0) -
             new Date((a.commit && a.commit.committer && a.commit.committer.date) || 0);
    });

    const body = json(request, {
      ok: true,
      cached_at: Date.now(),
      items: items.slice(0, 40),
    }, 200, REEL_CACHE_TTL_SECONDS);

    ctx.waitUntil(cache.put(cacheKey, body.clone()));
    return body;
  } catch (err) {
    return json(request, { error: "proxy-error", message: String(err.message || err) }, 500, 15);
  }
}

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
