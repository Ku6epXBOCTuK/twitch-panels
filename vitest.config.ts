import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    // Remove setupFiles temporarily to test basic functionality
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/**", ".svelte-kit/**", "tests/**", "*.config.ts", "*.config.js", "static/**"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      $lib: "/src/lib",
      $components: "/src/components",
      $stores: "/src/stores",
      $services: "/src/services",
    },
  },
});
