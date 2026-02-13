import { Theme } from "$lib/constants";
import { STATE_DATA } from "$states/persisted.svelte";
import { themeState } from "$states/theme.svelte";
import { describe, expect, it } from "vitest";

const THEME_VALUES = Object.values(Theme);

describe("theme.svelte", () => {
  describe("initial state", () => {
    it("should have valid initial theme value", () => {
      expect(THEME_VALUES).toContain(themeState.current);
    });
  });

  describe("toggle", () => {
    it("should toggle between themes", () => {
      themeState.current = Theme.LIGHT;
      themeState.toggle();
      expect(themeState.current).toBe(Theme.DARK);

      themeState.toggle();
      expect(themeState.current).toBe(Theme.LIGHT);
    });
  });

  describe("current setter", () => {
    it("should set theme correctly", () => {
      themeState.current = Theme.DARK;
      expect(themeState.current).toBe(Theme.DARK);

      themeState.current = Theme.LIGHT;
      expect(themeState.current).toBe(Theme.LIGHT);
    });
  });

  describe("STATE_DATA", () => {
    it("should serialize and deserialize theme", () => {
      themeState.current = Theme.DARK;
      expect(themeState[STATE_DATA]).toEqual({ current: Theme.DARK });

      themeState[STATE_DATA] = { current: Theme.LIGHT };
      expect(themeState.current).toBe(Theme.LIGHT);
    });
  });
});
