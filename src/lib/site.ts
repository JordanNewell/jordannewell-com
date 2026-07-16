export const SITE = {
  title: "Jordan Newell",
  description: "Field notes from an operator rebuilding in public across sectors.",
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
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/ventures", label: "Ventures" },
  { href: "/projects", label: "Projects" },
  { href: "/contributions", label: "Contributions" },
] as const;

export const TAG_COLORS: Record<string, string> = {
  rebuild: "#34D399",       // emerald
  infra: "#60A5FA",         // blue
  ventures: "#FBBF24",      // amber
  projects: "#A78BFA",      // violet
  contributions: "#22D3EE", // cyan
};
