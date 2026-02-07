import type { HexColor } from "$lib/types";
import { textConfigState } from "$states/textConfig.svelte";
import { describe, expect, it } from "vitest";

describe("textConfig.svelte", () => {
  describe("initial state", () => {
    it("should have default fontSize", () => {
      expect(textConfigState.fontSize).toBe(24);
    });

    it("should have default fontFamily", () => {
      expect(textConfigState.fontFamily).toBe("Arial");
    });

    it("should have default color", () => {
      expect(textConfigState.color).toBe("#ffffff");
    });

    it("should have default align", () => {
      expect(textConfigState.align).toBe("center");
    });

    it("should have default paddingX", () => {
      expect(textConfigState.paddingX).toBe(10);
    });

    it("should have default offsetY", () => {
      expect(textConfigState.offsetY).toBe(0);
    });

    it("should have all required properties", () => {
      expect(textConfigState).toHaveProperty("fontSize");
      expect(textConfigState).toHaveProperty("fontFamily");
      expect(textConfigState).toHaveProperty("color");
      expect(textConfigState).toHaveProperty("align");
      expect(textConfigState).toHaveProperty("paddingX");
      expect(textConfigState).toHaveProperty("offsetY");
    });
  });

  describe("fontSize", () => {
    it("should set fontSize", () => {
      textConfigState.fontSize = 32;
      expect(textConfigState.fontSize).toBe(32);
    });

    it("should accept positive values", () => {
      textConfigState.fontSize = 10;
      expect(textConfigState.fontSize).toBe(10);

      textConfigState.fontSize = 100;
      expect(textConfigState.fontSize).toBe(100);
    });

    it("should accept zero", () => {
      textConfigState.fontSize = 0;
      expect(textConfigState.fontSize).toBe(0);
    });

    it("should accept negative values", () => {
      textConfigState.fontSize = -10;
      expect(textConfigState.fontSize).toBe(-10);
    });

    it("should accept decimal values", () => {
      textConfigState.fontSize = 16.5;
      expect(textConfigState.fontSize).toBe(16.5);
    });
  });

  describe("fontFamily", () => {
    it("should set fontFamily", () => {
      textConfigState.fontFamily = "Roboto";
      expect(textConfigState.fontFamily).toBe("Roboto");
    });

    it("should accept common font families", () => {
      const fonts = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana"];

      fonts.forEach((font) => {
        textConfigState.fontFamily = font;
        expect(textConfigState.fontFamily).toBe(font);
      });
    });

    it("should accept empty string", () => {
      textConfigState.fontFamily = "";
      expect(textConfigState.fontFamily).toBe("");
    });

    it("should accept font families with spaces", () => {
      textConfigState.fontFamily = "Times New Roman";
      expect(textConfigState.fontFamily).toBe("Times New Roman");
    });
  });

  describe("color", () => {
    it("should set color", () => {
      textConfigState.color = "#ff0000";
      expect(textConfigState.color).toBe("#ff0000");
    });

    it("should accept valid hex colors", () => {
      const colors: Array<HexColor> = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#123456", "#abcdef"];

      colors.forEach((color) => {
        textConfigState.color = color;
        expect(textConfigState.color).toBe(color);
      });
    });

    it("should accept hex colors with uppercase", () => {
      textConfigState.color = "#FFFFFF";
      expect(textConfigState.color).toBe("#FFFFFF");
    });

    it("should accept hex colors with mixed case", () => {
      textConfigState.color = "#FfFfFf";
      expect(textConfigState.color).toBe("#FfFfFf");
    });
  });

  describe("align", () => {
    it("should set align", () => {
      textConfigState.align = "left";
      expect(textConfigState.align).toBe("left");
    });

    it("should accept left align", () => {
      textConfigState.align = "left";
      expect(textConfigState.align).toBe("left");
    });

    it("should accept center align", () => {
      textConfigState.align = "center";
      expect(textConfigState.align).toBe("center");
    });

    it("should accept right align", () => {
      textConfigState.align = "right";
      expect(textConfigState.align).toBe("right");
    });
  });

  describe("paddingX", () => {
    it("should set paddingX", () => {
      textConfigState.paddingX = 20;
      expect(textConfigState.paddingX).toBe(20);
    });

    it("should accept positive values", () => {
      textConfigState.paddingX = 10;
      expect(textConfigState.paddingX).toBe(10);

      textConfigState.paddingX = 100;
      expect(textConfigState.paddingX).toBe(100);
    });

    it("should accept zero", () => {
      textConfigState.paddingX = 0;
      expect(textConfigState.paddingX).toBe(0);
    });

    it("should accept negative values", () => {
      textConfigState.paddingX = -10;
      expect(textConfigState.paddingX).toBe(-10);
    });

    it("should accept decimal values", () => {
      textConfigState.paddingX = 15.5;
      expect(textConfigState.paddingX).toBe(15.5);
    });
  });

  describe("offsetY", () => {
    it("should set offsetY", () => {
      textConfigState.offsetY = 20;
      expect(textConfigState.offsetY).toBe(20);
    });

    it("should accept positive values", () => {
      textConfigState.offsetY = 10;
      expect(textConfigState.offsetY).toBe(10);

      textConfigState.offsetY = 100;
      expect(textConfigState.offsetY).toBe(100);
    });

    it("should accept zero", () => {
      textConfigState.offsetY = 0;
      expect(textConfigState.offsetY).toBe(0);
    });

    it("should accept negative values", () => {
      textConfigState.offsetY = -10;
      expect(textConfigState.offsetY).toBe(-10);
    });

    it("should accept decimal values", () => {
      textConfigState.offsetY = 15.5;
      expect(textConfigState.offsetY).toBe(15.5);
    });
  });

  describe("integration", () => {
    it("should maintain independent values", () => {
      textConfigState.fontSize = 32;
      textConfigState.fontFamily = "Roboto";
      textConfigState.color = "#ff0000";
      textConfigState.align = "left";
      textConfigState.paddingX = 20;
      textConfigState.offsetY = -10;

      expect(textConfigState.fontSize).toBe(32);
      expect(textConfigState.fontFamily).toBe("Roboto");
      expect(textConfigState.color).toBe("#ff0000");
      expect(textConfigState.align).toBe("left");
      expect(textConfigState.paddingX).toBe(20);
      expect(textConfigState.offsetY).toBe(-10);
    });

    it("should handle multiple updates", () => {
      const initialFontSize = textConfigState.fontSize;

      textConfigState.fontSize = 32;
      expect(textConfigState.fontSize).toBe(32);

      textConfigState.fontSize = 48;
      expect(textConfigState.fontSize).toBe(48);

      textConfigState.fontSize = initialFontSize;
      expect(textConfigState.fontSize).toBe(initialFontSize);
    });
  });
});
