// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jordannewell.com',
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  redirects: {
    // OPSEC rename July 2026: <codename> -> agent-orchestration (no public artifact)
    '/projects/<codename>': '/projects/agent-orchestration/',
    '/projects/<codename>/': '/projects/agent-orchestration/',
  },
  integrations: [sitemap()]
});
