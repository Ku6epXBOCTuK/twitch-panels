import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{js,ts}"],
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
  },
  resolve: process.env.VITEST
    ? {
        conditions: ["browser"],
      }
    : undefined,
});
