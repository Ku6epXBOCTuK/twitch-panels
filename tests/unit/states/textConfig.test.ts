import { TextAlign } from "$lib/constants";
import type { HexColor } from "$lib/types";
import { textConfigState } from "$states/textConfig.svelte";
import { describe, expect, it } from "vitest";

const TEXT_ALIGN_VALUES = Object.values(TextAlign);

describe("textConfig.svelte", () => {
  describe("initial state", () => {
    it("should have valid initial state structure", () => {
      expect(typeof textConfigState.fontSize).toBe("number");
      expect(typeof textConfigState.fontFamily).toBe("string");
      expect(typeof textConfigState.color).toBe("string");
      expect(textConfigState.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(TEXT_ALIGN_VALUES).toContain(textConfigState.align);
      expect(typeof textConfigState.paddingX).toBe("number");
      expect(typeof textConfigState.offsetY).toBe("number");
    });
  });

  describe("property setters", () => {
    it("should update all properties correctly", () => {
      textConfigState.fontSize = 32;
      textConfigState.fontFamily = "Roboto";
      textConfigState.color = "#ff0000" as HexColor;
      textConfigState.align = TextAlign.LEFT;
      textConfigState.paddingX = 20;
      textConfigState.offsetY = -10;

      expect(textConfigState.fontSize).toBe(32);
      expect(textConfigState.fontFamily).toBe("Roboto");
      expect(textConfigState.color).toBe("#ff0000");
      expect(textConfigState.align).toBe(TextAlign.LEFT);
      expect(textConfigState.paddingX).toBe(20);
      expect(textConfigState.offsetY).toBe(-10);
    });
  });

  describe("persistence", () => {
    it("should serialize and deserialize state", () => {
      textConfigState.fontSize = 18;
      textConfigState.fontFamily = "Georgia";
      textConfigState.color = "#00ff00" as HexColor;
      textConfigState.align = TextAlign.RIGHT;
      textConfigState.paddingX = 5;
      textConfigState.offsetY = 15;

      const data = textConfigState.toSnapshot();
      expect(data).toEqual({
        fontSize: 18,
        fontFamily: "Georgia",
        color: "#00ff00",
        align: TextAlign.RIGHT,
        paddingX: 5,
        offsetY: 15,
        outlined: false,
      });

      textConfigState.fromSnapshot({
        fontSize: 24,
        fontFamily: "Arial",
        color: "#ffffff" as HexColor,
        align: TextAlign.CENTER,
        paddingX: 10,
        offsetY: 0,
      });

      expect(textConfigState.fontSize).toBe(24);
      expect(textConfigState.fontFamily).toBe("Arial");
      expect(textConfigState.color).toBe("#ffffff");
      expect(textConfigState.align).toBe(TextAlign.CENTER);
      expect(textConfigState.paddingX).toBe(10);
      expect(textConfigState.offsetY).toBe(0);
    });
  });
});
