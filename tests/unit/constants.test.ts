import * as Constants from "$lib/constants";
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

describe("Application Constants Logic", () => {
  describe("Typography & Panel Constraints", () => {
    it("should have default values within allowed boundaries", () => {
      const { TYPOGRAPHY, PANEL_SETTINGS } = Constants;

      expect(TYPOGRAPHY.FONT_SIZE_DEFAULT).toBeGreaterThanOrEqual(TYPOGRAPHY.FONT_SIZE_MIN);
      expect(TYPOGRAPHY.FONT_SIZE_DEFAULT).toBeLessThanOrEqual(TYPOGRAPHY.FONT_SIZE_MAX);

      expect(TYPOGRAPHY.FONT_FAMILIES).toContain(TYPOGRAPHY.FONT_FAMILY_DEFAULT);

      expect(PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT).toBeLessThanOrEqual(
        PANEL_SETTINGS.PANEL_HEIGHT_MAX,
      );

      expect(TYPOGRAPHY.OFFSET_Y_MAX).toBeGreaterThan(TYPOGRAPHY.OFFSET_Y_MIN);
    });

    it("should not have duplicate values in lists", () => {
      const { TYPOGRAPHY, IMAGE_SETTINGS } = Constants;

      const uniqueFonts = new Set(TYPOGRAPHY.FONT_FAMILIES);
      expect(uniqueFonts.size).toBe(TYPOGRAPHY.FONT_FAMILIES.length);

      const uniqueFormats = new Set(IMAGE_SETTINGS.SUPPORTED_FORMATS);
      expect(uniqueFormats.size).toBe(IMAGE_SETTINGS.SUPPORTED_FORMATS.length);
    });
  });

  describe("Integrity & Formats", () => {
    it("should have valid format patterns for colors and mime-types", () => {
      const { TYPOGRAPHY, IMAGE_SETTINGS } = Constants;

      expect(TYPOGRAPHY.TEXT_COLOR_DEFAULT).toMatch(/^#[0-9a-f]{6}$/i);

      IMAGE_SETTINGS.SUPPORTED_FORMATS.forEach((format) => {
        expect(format).toMatch(/^image\/(jpeg|jpg|png|webp|gif)$/);
      });
    });
  });

  describe("Environment Specifics", () => {
    it("should set transition duration to 0 in test mode", () => {
      expect(Constants.TRANSITION_DURATION).toBe(0);
    });
  });

  describe("Global Contract (Snapshot)", () => {
    it("should match the previous configuration snapshot", () => {
      expect(Constants).toMatchSnapshot();
    });
  });

  describe("Assets Existence", () => {
    it("should verify that the default background image exists", () => {
      const { DEFAULT_BACKGROUND_IMAGE } = Constants.IMAGE_SETTINGS;

      const relativePath = DEFAULT_BACKGROUND_IMAGE.replace(/^\.\//, "");
      const fullPath = path.resolve(process.cwd(), "static", relativePath);

      const exists = fs.existsSync(fullPath);

      expect(exists, `Image not found at: ${fullPath}`).toBe(true);
    });
  });
});
