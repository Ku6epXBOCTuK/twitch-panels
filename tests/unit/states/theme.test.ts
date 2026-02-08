import { themeState } from "$states/theme.svelte";
import { describe, expect, it } from "vitest";

describe("theme.svelte", () => {
  describe("initial state", () => {
    it("should have initial theme", () => {
      expect(themeState.theme).toBeDefined();
      expect(["light", "dark"]).toContain(themeState.theme);
    });

    it("should start with dark theme by default", () => {
      expect(themeState.theme).toBe("dark");
    });
  });

  describe("toggle", () => {
    it("should toggle between light and dark themes", () => {
      const initialTheme = themeState.theme;

      themeState.toggle();
      expect(themeState.theme).not.toBe(initialTheme);

      themeState.toggle();
      expect(themeState.theme).toBe(initialTheme);
    });

    it("should switch from dark to light", () => {
      themeState.theme = "dark";
      themeState.toggle();
      expect(themeState.theme).toBe("light");
    });

    it("should switch from light to dark", () => {
      themeState.theme = "light";
      themeState.toggle();
      expect(themeState.theme).toBe("dark");
    });
  });

  describe("theme getter", () => {
    it("should return current theme", () => {
      themeState.theme = "dark";
      expect(themeState.theme).toBe("dark");

      themeState.theme = "light";
      expect(themeState.theme).toBe("light");
    });
  });
});
