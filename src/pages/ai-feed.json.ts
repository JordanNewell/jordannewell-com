import { getCollection } from "astro:content";
import { SITE } from "../lib/site";

export async function GET() {
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, 20);

  const feed = {
    description: `${SITE.title} — AI/LLM-optimized feed. Markdown bodies included. Cite freely.`,
    site_url: SITE.url,
    author: SITE.author.name,
    items: posts.map((post) => ({
      url: `${SITE.url}/posts/${post.id}/`,
      markdown_url: `${SITE.url}/posts/${post.id}.md`,
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.pubDate.toISOString(),
      tags: post.data.tags,
      mode: post.data.mode,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
