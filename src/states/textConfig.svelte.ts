import type { TextAlignType } from "$lib/constants";
import type { HexColor } from "$lib/types";

export type TextConfig = {
  fontSize: number;
  fontFamily: string;
  color: HexColor;
  align: TextAlignType;
  paddingX: number;
  offsetY: number;
};

function createState() {
  const defaults: TextConfig = {
    fontSize: 24,
    fontFamily: "Arial",
    color: "#ffffff",
    align: "center",
    paddingX: 10,
    offsetY: 0,
  };
  let state: TextConfig = $state({ ...defaults });

  return {
    get fontSize() {
      return state.fontSize;
    },
    set fontSize(value: number) {
      state.fontSize = value;
    },
    get fontFamily() {
      return state.fontFamily;
    },
    set fontFamily(fontFamily: string) {
      state.fontFamily = fontFamily;
    },
    get color() {
      return state.color;
    },
    set color(color: HexColor) {
      state.color = color;
    },
    get align() {
      return state.align;
    },
    set align(align: TextAlignType) {
      state.align = align;
    },
    get paddingX() {
      return state.paddingX;
    },
    set paddingX(paddingX: number) {
      state.paddingX = paddingX;
    },
    get offsetY() {
      return state.offsetY;
    },
    set offsetY(offsetY: number) {
      state.offsetY = offsetY;
    },
  };
}

export const textConfigState = createState();
