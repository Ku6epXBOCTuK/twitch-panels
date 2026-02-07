import {
  PANEL_SETTINGS,
  TYPOGRAPHY,
  IMAGE_SETTINGS,
  SlideDirection,
  type SlideDirectionType,
  TextAlign,
  type TextAlignType,
  DEFAULT_TEXT_ALIGN,
} from "$lib/constants";
import { describe, expect, it } from "vitest";

describe("constants", () => {
  describe("PANEL_SETTINGS", () => {
    it("should have correct panel width", () => {
      expect(PANEL_SETTINGS.PANEL_WIDTH).toBe(320);
    });

    it("should have correct default panel height", () => {
      expect(PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT).toBe(100);
    });

    it("should have correct max panel height", () => {
      expect(PANEL_SETTINGS.PANEL_HEIGHT_MAX).toBe(200);
    });

    it("should have default background image path", () => {
      expect(PANEL_SETTINGS.DEFAULT_BACKGROUND_IMAGE).toBe("./backgrounds/b1.jpg");
    });

    it("should have all required properties", () => {
      expect(PANEL_SETTINGS).toHaveProperty("PANEL_WIDTH");
      expect(PANEL_SETTINGS).toHaveProperty("PANEL_HEIGHT_DEFAULT");
      expect(PANEL_SETTINGS).toHaveProperty("PANEL_HEIGHT_MAX");
      expect(PANEL_SETTINGS).toHaveProperty("DEFAULT_BACKGROUND_IMAGE");
    });

    it("should have numeric dimensions", () => {
      expect(typeof PANEL_SETTINGS.PANEL_WIDTH).toBe("number");
      expect(typeof PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT).toBe("number");
      expect(typeof PANEL_SETTINGS.PANEL_HEIGHT_MAX).toBe("number");
    });

    it("should have string background image path", () => {
      expect(typeof PANEL_SETTINGS.DEFAULT_BACKGROUND_IMAGE).toBe("string");
    });

    it("should have valid panel dimensions", () => {
      expect(PANEL_SETTINGS.PANEL_WIDTH).toBeGreaterThan(0);
      expect(PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT).toBeGreaterThan(0);
      expect(PANEL_SETTINGS.PANEL_HEIGHT_MAX).toBeGreaterThan(PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT);
    });
  });

  describe("TYPOGRAPHY", () => {
    it("should have default font family", () => {
      expect(TYPOGRAPHY.FONT_FAMILY_DEFAULT).toBe("Arial");
    });

    it("should have array of font families", () => {
      expect(Array.isArray(TYPOGRAPHY.FONT_FAMILIES)).toBe(true);
      expect(TYPOGRAPHY.FONT_FAMILIES.length).toBeGreaterThan(0);
    });

    it("should include default font in font families", () => {
      expect(TYPOGRAPHY.FONT_FAMILIES).toContain(TYPOGRAPHY.FONT_FAMILY_DEFAULT);
    });

    it("should have correct font size range", () => {
      expect(TYPOGRAPHY.FONT_SIZE_MIN).toBe(10);
      expect(TYPOGRAPHY.FONT_SIZE_MAX).toBe(72);
      expect(TYPOGRAPHY.FONT_SIZE_DEFAULT).toBe(32);
    });

    it("should have valid font size range", () => {
      expect(TYPOGRAPHY.FONT_SIZE_MIN).toBeLessThan(TYPOGRAPHY.FONT_SIZE_MAX);
      expect(TYPOGRAPHY.FONT_SIZE_DEFAULT).toBeGreaterThanOrEqual(TYPOGRAPHY.FONT_SIZE_MIN);
      expect(TYPOGRAPHY.FONT_SIZE_DEFAULT).toBeLessThanOrEqual(TYPOGRAPHY.FONT_SIZE_MAX);
    });

    it("should have max text length", () => {
      expect(TYPOGRAPHY.MAX_TEXT_LENGTH).toBe(100);
      expect(typeof TYPOGRAPHY.MAX_TEXT_LENGTH).toBe("number");
      expect(TYPOGRAPHY.MAX_TEXT_LENGTH).toBeGreaterThan(0);
    });

    it("should have padding settings", () => {
      expect(TYPOGRAPHY.PADDING_X_DEFAULT).toBe(10);
      expect(TYPOGRAPHY.PADDING_X_MAX).toBe(100);
      expect(typeof TYPOGRAPHY.PADDING_X_DEFAULT).toBe("number");
      expect(typeof TYPOGRAPHY.PADDING_X_MAX).toBe("number");
    });

    it("should have valid padding range", () => {
      expect(TYPOGRAPHY.PADDING_X_DEFAULT).toBeLessThanOrEqual(TYPOGRAPHY.PADDING_X_MAX);
      expect(TYPOGRAPHY.PADDING_X_DEFAULT).toBeGreaterThanOrEqual(0);
    });

    it("should have vertical offset settings", () => {
      expect(TYPOGRAPHY.VERTICAL_OFFSET_MAX).toBe(100);
      expect(TYPOGRAPHY.VERTICAL_OFFSET_MIN).toBe(-100);
      expect(typeof TYPOGRAPHY.VERTICAL_OFFSET_MAX).toBe("number");
      expect(typeof TYPOGRAPHY.VERTICAL_OFFSET_MIN).toBe("number");
    });

    it("should have valid vertical offset range", () => {
      expect(TYPOGRAPHY.VERTICAL_OFFSET_MIN).toBeLessThan(TYPOGRAPHY.VERTICAL_OFFSET_MAX);
    });

    it("should have default text color", () => {
      expect(TYPOGRAPHY.TEXT_COLOR_DEFAULT).toBe("#ffffff");
      expect(typeof TYPOGRAPHY.TEXT_COLOR_DEFAULT).toBe("string");
    });

    it("should have valid hex color format for default text color", () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      expect(TYPOGRAPHY.TEXT_COLOR_DEFAULT).toMatch(hexColorRegex);
    });

    it("should have all required typography properties", () => {
      expect(TYPOGRAPHY).toHaveProperty("FONT_FAMILY_DEFAULT");
      expect(TYPOGRAPHY).toHaveProperty("FONT_FAMILIES");
      expect(TYPOGRAPHY).toHaveProperty("FONT_SIZE_MIN");
      expect(TYPOGRAPHY).toHaveProperty("FONT_SIZE_MAX");
      expect(TYPOGRAPHY).toHaveProperty("FONT_SIZE_DEFAULT");
      expect(TYPOGRAPHY).toHaveProperty("MAX_TEXT_LENGTH");
      expect(TYPOGRAPHY).toHaveProperty("PADDING_X_DEFAULT");
      expect(TYPOGRAPHY).toHaveProperty("PADDING_X_MAX");
      expect(TYPOGRAPHY).toHaveProperty("VERTICAL_OFFSET_MAX");
      expect(TYPOGRAPHY).toHaveProperty("VERTICAL_OFFSET_MIN");
      expect(TYPOGRAPHY).toHaveProperty("TEXT_COLOR_DEFAULT");
    });
  });

  describe("IMAGE_SETTINGS", () => {
    it("should have correct max file size", () => {
      expect(IMAGE_SETTINGS.MAX_FILE_SIZE).toBe(10 * 1024 * 1024); // 10MB
    });

    it("should have array of supported formats", () => {
      expect(Array.isArray(IMAGE_SETTINGS.SUPPORTED_FORMATS)).toBe(true);
      expect(IMAGE_SETTINGS.SUPPORTED_FORMATS.length).toBeGreaterThan(0);
    });

    it("should include common image formats", () => {
      expect(IMAGE_SETTINGS.SUPPORTED_FORMATS).toContain("image/jpeg");
      expect(IMAGE_SETTINGS.SUPPORTED_FORMATS).toContain("image/png");
      expect(IMAGE_SETTINGS.SUPPORTED_FORMATS).toContain("image/webp");
    });

    it("should have all required image settings properties", () => {
      expect(IMAGE_SETTINGS).toHaveProperty("MAX_FILE_SIZE");
      expect(IMAGE_SETTINGS).toHaveProperty("SUPPORTED_FORMATS");
    });

    it("should have valid file size", () => {
      expect(typeof IMAGE_SETTINGS.MAX_FILE_SIZE).toBe("number");
      expect(IMAGE_SETTINGS.MAX_FILE_SIZE).toBeGreaterThan(0);
    });

    it("should have string format types", () => {
      IMAGE_SETTINGS.SUPPORTED_FORMATS.forEach(format => {
        expect(typeof format).toBe("string");
        expect(format).toMatch(/^image\//);
      });
    });
  });

  describe("SlideDirection", () => {
    it("should have NEXT and PREV directions", () => {
      expect(SlideDirection.NEXT).toBe("next");
      expect(SlideDirection.PREV).toBe("prev");
    });

    it("should have correct type for slide directions", () => {
      const next: SlideDirectionType = SlideDirection.NEXT;
      const prev: SlideDirectionType = SlideDirection.PREV;

      expect(next).toBe("next");
      expect(prev).toBe("prev");
    });

    it("should have all required slide direction properties", () => {
      expect(SlideDirection).toHaveProperty("NEXT");
      expect(SlideDirection).toHaveProperty("PREV");
    });

    it("should have string values for directions", () => {
      expect(typeof SlideDirection.NEXT).toBe("string");
      expect(typeof SlideDirection.PREV).toBe("string");
    });
  });

  describe("TextAlign", () => {
    it("should have LEFT, CENTER and RIGHT alignments", () => {
      expect(TextAlign.LEFT).toBe("left");
      expect(TextAlign.CENTER).toBe("center");
      expect(TextAlign.RIGHT).toBe("right");
    });

    it("should have correct type for text alignments", () => {
      const left: TextAlignType = TextAlign.LEFT;
      const center: TextAlignType = TextAlign.CENTER;
      const right: TextAlignType = TextAlign.RIGHT;

      expect(left).toBe("left");
      expect(center).toBe("center");
      expect(right).toBe("right");
    });

    it("should have all required text alignment properties", () => {
      expect(TextAlign).toHaveProperty("LEFT");
      expect(TextAlign).toHaveProperty("CENTER");
      expect(TextAlign).toHaveProperty("RIGHT");
    });

    it("should have string values for alignments", () => {
      expect(typeof TextAlign.LEFT).toBe("string");
      expect(typeof TextAlign.CENTER).toBe("string");
      expect(typeof TextAlign.RIGHT).toBe("string");
    });
  });

  describe("DEFAULT_TEXT_ALIGN", () => {
    it("should be CENTER by default", () => {
      expect(DEFAULT_TEXT_ALIGN).toBe("center");
    });

    it("should be of type TextAlignType", () => {
      const align: TextAlignType = DEFAULT_TEXT_ALIGN;
      expect(align).toBe("center");
    });

    it("should match one of the TextAlign values", () => {
      expect([TextAlign.LEFT, TextAlign.CENTER, TextAlign.RIGHT]).toContain(DEFAULT_TEXT_ALIGN);
    });
  });

  describe("Constants integration", () => {
    it("should have consistent panel dimensions", () => {
      expect(PANEL_SETTINGS.PANEL_WIDTH).toBe(320);
      expect(TYPOGRAPHY.PADDING_X_MAX).toBeLessThan(PANEL_SETTINGS.PANEL_WIDTH / 2);
    });

    it("should have valid text constraints for panel width", () => {
      const maxTextWidth = PANEL_SETTINGS.PANEL_WIDTH - 2 * TYPOGRAPHY.PADDING_X_MAX;
      expect(maxTextWidth).toBeGreaterThan(0);
    });

    it("should have reasonable font size range for panel height", () => {
      const minFontSize = TYPOGRAPHY.FONT_SIZE_MIN;
      const maxFontSize = TYPOGRAPHY.FONT_SIZE_MAX;
      const panelHeight = PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT;

      expect(minFontSize).toBeLessThan(panelHeight);
      expect(maxFontSize).toBeLessThan(panelHeight * 2);
    });
  });
});
