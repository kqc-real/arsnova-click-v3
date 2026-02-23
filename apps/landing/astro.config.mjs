import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// base: bei GitHub Pages = /<repo-name>/ (Projekt-Site), sonst / (eigene Domain)
const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://arsnova.click',
  base,
  integrations: [tailwind()],
  output: 'static',
});
