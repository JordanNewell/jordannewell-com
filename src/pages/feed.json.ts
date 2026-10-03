import { getCollection } from "astro:content";
import { SITE } from "../lib/site";

export async function GET() {
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE.title,
    description: SITE.description,
    home_page_url: SITE.url,
    feed_url: `${SITE.url}/feed.json`,
    authors: [{ name: SITE.author.name, url: SITE.author.url }],
    items: posts.map((post) => ({
      id: `${SITE.url}/posts/${post.id}/`,
      url: `${SITE.url}/posts/${post.id}/`,
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.pubDate.toISOString(),
      tags: post.data.tags,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
