export const SITE = {
  title: "Jordan Newell",
  description: "Field notes from an operator shipping in public across sectors.",
  url: "https://jordannewell.com",
  author: {
    name: "Jordan Newell",
    email: "jordan@jordannewell.com",
    url: "https://jordannewell.com/about",
    sameAs: [
      "https://github.com/jordannewell",
      "https://x.com/newellops",
      "https://bsky.app/profile/jordannewell.com",
    ],
  },
  social: {},
} as const;

export const NAV_LINKS = [
  { href: "/posts", label: "Posts" },
  { href: "/projects", label: "Projects" },
  { href: "/products", label: "Products" },
  { href: "/ventures", label: "Ventures" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
] as const;

// Empty while /contributions is retired (see src/pages/_disabled/).
// Re-add entries here when those pages return.
export const FOOTER_LINKS: { href: string; label: string; emoji: string }[] = [];

export const TAG_COLORS: Record<string, string> = {
  rebuild: "#34D399",       // emerald
  infra: "#60A5FA",         // blue
  ventures: "#FBBF24",      // amber
  projects: "#A78BFA",      // violet
  contributions: "#22D3EE", // cyan
  ai: "#F472B6",            // pink
  tooling: "#FB923C",       // orange
  security: "#F87171",      // red
  oss: "#A3E635",           // lime
};
