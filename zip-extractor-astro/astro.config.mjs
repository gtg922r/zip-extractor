// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://gtg922r.github.io',
  base: '/zip-extractor',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false
    })
  ]
});