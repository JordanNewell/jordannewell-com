import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../../lib/site";

// itunes:duration takes integer seconds; episodes store "9:41" clock strings.
function durationToSeconds(duration: string): number {
  return duration.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

export async function GET(context: { site: URL }) {
  const episodes = (await getCollection("podcast"))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const year = new Date().getFullYear();
  return rss({
    title: "The Standup",
    description:
      "The Standup reads this site's posts out loud — an ensemble of synthesized voices, generated from the blog. Same field notes, now audible.",
    site: context.site,
    xmlns: { itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd" },
    items: episodes.map((episode) => ({
      title: episode.data.title,
      description: episode.data.description,
      pubDate: episode.data.pubDate,
      enclosure: {
        url: episode.data.enclosureUrl,
        length: episode.data.fileSize,
        type: "audio/mpeg",
      },
      customData: `<itunes:duration>${durationToSeconds(episode.data.duration)}</itunes:duration><guid isPermaLink="false">${episode.data.slug}</guid>`,
    })),
    customData: `<language>en-us</language><link>${SITE.url}/podcast/</link><itunes:author>${SITE.author.name}</itunes:author><itunes:summary>The Standup reads this site's posts out loud — an ensemble of synthesized voices, generated from the blog. Same field notes, now audible.</itunes:summary><itunes:explicit>false</itunes:explicit><itunes:image href="${SITE.url}/og-card.png" /><itunes:owner><itunes:name>${SITE.author.name}</itunes:name><itunes:email>${SITE.author.email}</itunes:email></itunes:owner><itunes:category text="Technology" /><copyright>© ${year} Jordan Newell. Content licensed CC BY-NC 4.0. Code licensed MIT.</copyright>`,
  });
}
