// Pages Function — GET /og-now.png
// WhatsApp center-crops wide OG cards to ~1:1, gutting the composition.
// Serve the purpose-built square variant only to WhatsApp's crawler; every
// other platform gets the static wide card via context.next().
// Square source: scripts/og_card_gen.py render_square() — regenerate both
// cards together if the Now page ever changes title/sub.

interface Env {
  ASSETS: { fetch: (url: string) => Promise<Response> };
}

export const onRequest: ExportedHandler<Env> = async (context) => {
  const ua = context.request.headers.get("User-Agent") ?? "";
  if (/WhatsApp/i.test(ua)) {
    const url = new URL(context.request.url);
    const res = await context.env.ASSETS.fetch(`${url.origin}/og-now-square.png`);
    return new Response(res.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=14400, must-revalidate",
        // caches must key on UA or they will serve one variant to both
        Vary: "User-Agent",
      },
    });
  }
  return context.next();
};
