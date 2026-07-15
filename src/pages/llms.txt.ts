import { getCollection } from "astro:content";
import { SITE } from "../lib/site";

export async function GET() {
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const projects = (await getCollection("projects"))
    .sort((a, b) => a.data.order - b.data.order);

  const lines = [
    `# ${SITE.title}`,
    ``,
    `> ${SITE.description}`,
    ``,
    `## Core topics (canonical explainers)`,
    ...posts.slice(0, 10).map((p) => `- [${p.data.title}](${SITE.url}/posts/${p.id}.md): ${p.data.description}`),
    ``,
    `## Projects`,
    ...projects.map((p) => `- [${p.data.title}](${SITE.url}/projects/${p.id}/): ${p.data.description}`),
    ``,
    `## Optional`,
    `- [About](${SITE.url}/about)`,
    `- [Now](${SITE.url}/now)`,
    `- [Contributions](${SITE.url}/contributions)`,
    `- [RSS](${SITE.url}/rss.xml)`,
    `- [AI Feed](${SITE.url}/ai-feed.json)`,
    ``,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
