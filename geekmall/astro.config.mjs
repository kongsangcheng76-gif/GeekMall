// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kongsangcheng76-gif.github.io',
  base: '/geekmall',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
