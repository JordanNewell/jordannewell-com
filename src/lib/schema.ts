import { SITE } from "./site";

export function personSchema() {
  return {
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: SITE.author.name,
    email: SITE.author.email,
    url: SITE.author.url,
    sameAs: SITE.author.sameAs,
    jobTitle: "Operator",
    description: SITE.description,
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/tags/{search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  slug: string;
  tags: string[];
}) {
  return {
    "@type": "BlogPosting",
    "@id": `${SITE.url}/posts/${opts.slug}#article`,
    headline: opts.title,
    description: opts.description,
    datePublished: opts.pubDate.toISOString(),
    dateModified: (opts.updatedDate ?? opts.pubDate).toISOString(),
    author: { "@id": `${SITE.url}/#person` },
    publisher: { "@id": `${SITE.url}/#person` },
    mainEntityOfPage: `${SITE.url}/posts/${opts.slug}`,
    keywords: opts.tags.join(", "),
  };
}

export function graphSchema(...types: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personSchema(),
      websiteSchema(),
      ...types,
    ],
  };
}
