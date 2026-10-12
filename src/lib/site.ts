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
  { href: "/now", label: "Now" },
  { href: "/products", label: "Products" },
] as const;

// Pages demoted from the header live here — the footer is the full index.
export const FOOTER_PAGE_LINKS = [
  { href: "/about", label: "about" },
  { href: "/posts", label: "posts" },
] as const;

// Categorical inks — ledger-safe ink hues, one per tag family
export const TAG_COLORS: Record<string, string> = {
  rebuild: "#0E8A4A",       // green pen
  infra: "#1F4FD8",         // blue pen
  ventures: "#A16207",      // amber ink
  projects: "#6D28D9",      // violet ink
  contributions: "#0E7490", // teal ink
  ai: "#BE185D",            // pink ink
  tooling: "#C2410C",       // orange ink
  security: "#DC2626",      // red ink
  oss: "#4D7C0F",           // olive ink
};
