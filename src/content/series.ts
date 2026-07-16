export interface SeriesMeta {
  slug: string;
  name: string;
  description: string;
  tool?: string;
  era?: string;
  order: number;
}

export const series: SeriesMeta[] = [
  {
    slug: "claude",
    name: "Off-Model · Claude: Agentic Hours",
    description:
      "Long-form, infra-level sessions with Claude Code. Agentic hours at the command line.",
    tool: "claude-code",
    order: 10,
  },
  {
    slug: "grok",
    name: "Off-Model · Grok: Unfiltered",
    description:
      "Strategic and philosophical sessions with Grok. Off the guardrails.",
    tool: "grok",
    order: 20,
  },
  {
    slug: "gpt",
    name: "Off-Model · GPT: Polished",
    description:
      "Sanded-down, structured, RLHF'd. The polished framing writes itself.",
    tool: "gpt",
    order: 30,
  },
  {
    slug: "gemini",
    name: "Off-Model · Gemini: Polyglot",
    description:
      "Multimodal, web-grounded, Google ecosystem ties.",
    tool: "gemini",
    order: 40,
  },
  {
    slug: "heritage",
    name: "Heritage",
    description:
      "Pre-fleet origin story. Where this started, before \"agent OS\" was a category.",
    era: "2025-curtis",
    order: 50,
  },
];

export function getSeries(slug: string): SeriesMeta | undefined {
  return series.find((s) => s.slug === slug);
}
