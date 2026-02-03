import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    prerender: {
      handleHttpError: "ignore",
    },
    output: {
      bundleStrategy: "inline",
    },
  },
  compilerOptions: {
    runes: true,
  },
};

export default config;
