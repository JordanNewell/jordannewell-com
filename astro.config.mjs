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

  integrations: [
    sitemap({
      // Internal/utility pages carry noindex — keep them out of the sitemap
      // so we're not telling crawlers "index this" and "don't index this".
      filter: (page) => !page.includes('/logo-variations/'),
    }),
  ],
});