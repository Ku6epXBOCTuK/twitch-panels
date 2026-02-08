import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: "svelte",
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    isolate: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{js,ts}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.svelte-kit/**", "**/build/**"],
    env: {
      DEBUG_PRINT_LIMIT: "0",
    },
    coverage: {
      provider: "istanbul",
      enabled: true,
      include: ["src/**/*.{js,ts,svelte}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/types.ts",
        "src/**/index.ts",
        "**/*.config.*",
        "**/build/**",
        "**/node_modules/**",
        "**/coverage/**",
      ],
    },
    server: {
      deps: {
        inline: [/unplugin-icons/],
      },
    },
  },
  resolve: process.env.VITEST
    ? {
        conditions: ["browser"],
      }
    : undefined,
});
