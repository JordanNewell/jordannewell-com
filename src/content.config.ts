import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    mode: z.enum(["hobart", "murphy"]).default("hobart"),
    draft: z.boolean().default(false),
    project: z.string().optional(),
    // Sessions from the Vault additions (all optional, backwards-compatible)
    series: z.array(z.string()).default([]),
    tool: z.enum(["claude-code", "grok", "gpt", "gemini", "cursor", "aider", "other"]).optional(),
    era: z.enum(["2025-curtis", "2026-fleet"]).optional(),
    session: z.string().optional(),
    kind: z.enum(["postmortem", "win", "decision", "debug-story", "tooling", "conversation"]).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["active", "shipped", "exploratory", "venture-track", "deprecated"]).default("active"),
    startDate: z.coerce.date().optional(),
    shipDate: z.coerce.date().optional(),
    deprecatedDate: z.coerce.date().optional(),
    successor: z.string().optional(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    pkg: z.string().url().optional(),
    order: z.number().default(99),
    facts: z
      .array(z.object({ k: z.string(), v: z.string() }))
      .optional(),
    highlights: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .optional(),
    stack: z.array(z.string()).optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    status: z.enum(["released", "beta", "preview"]).default("released"),
    shipDate: z.coerce.date(),
    repo: z.string().url(),
    homepage: z.string().url().optional(),
    logo: z.string().optional(),
    platform: z
      .object({
        name: z.string(),
        url: z.string().url(),
      })
      .optional(),
    install: z.array(
      z.object({
        label: z.string(),
        kind: z.enum(["directory", "brat", "npm", "pip", "manual", "homebrew", "other"]),
        href: z.string().url().optional(),
        detail: z.string().optional(),
      }),
    ).default([]),
    pricing: z.enum(["free", "free-oss", "freemium", "paid"]).default("free-oss"),
    license: z.string().default("MIT"),
    stats: z
      .array(z.object({ k: z.string(), v: z.string() }))
      .default([]),
    features: z
      .array(
        z.object({
          icon: z.string().optional(),
          title: z.string(),
          body: z.string(),
          docUrl: z.string().optional(),
        }),
      )
      .default([]),
    comparison: z
      .object({
        title: z.string().optional(),
        columns: z.array(z.string()),
        rows: z.array(
          z.object({
            label: z.string(),
            cells: z.array(z.string()),
          }),
        ),
      })
      .optional(),
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .default([]),
    privacy: z.string().optional(),
    ogImage: z.string().optional(),
    order: z.number().default(99),
  }),
});

const contributions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/contributions" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    project: z.string(),
    date: z.coerce.date(),
    type: z.enum(["bug-report", "pr-merged", "community", "research"]).default("bug-report"),
    url: z.string().url(),
    outcome: z.string(),
    status: z.enum(["shipped", "open", "investigating", "closed-wontfix"]).default("shipped"),
    order: z.number().default(99),
  }),
});

export const collections = { posts, projects, products, contributions };
