import { TEXT_ALIGN_DEFAULT, TYPOGRAPHY, type TextAlignType } from "$lib/constants";
import type { HexColor } from "$lib/types";
import { withPersistence, type Persistable } from "./persisted.svelte";

export type TextConfigDTO = {
  fontSize: number;
  fontFamily: string;
  color: HexColor;
  align: TextAlignType;
  paddingX: number;
  offsetY: number;
  outlined: boolean;
};

const textConfigKeys: (keyof TextConfigDTO)[] = [
  "fontSize",
  "fontFamily",
  "color",
  "align",
  "paddingX",
  "offsetY",
  "outlined",
];

export class TextConfigState implements Persistable<TextConfigDTO> {
  fontSize: number = $state(TYPOGRAPHY.FONT_SIZE_DEFAULT);
  fontFamily: string = $state(TYPOGRAPHY.FONT_FAMILY_DEFAULT);
  color: HexColor = $state(TYPOGRAPHY.TEXT_COLOR_DEFAULT);
  align: TextAlignType = $state(TEXT_ALIGN_DEFAULT);
  paddingX: number = $state(TYPOGRAPHY.PADDING_X_DEFAULT);
  offsetY: number = $state(TYPOGRAPHY.OFFSET_Y_DEFAULT);
  outlined: boolean = $state(false);

  toSnapshot(): TextConfigDTO {
    return {
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      color: this.color,
      align: this.align,
      paddingX: this.paddingX,
      offsetY: this.offsetY,
      outlined: this.outlined,
    };
  }

  fromSnapshot(data: Partial<TextConfigDTO>): void {
    for (const key of textConfigKeys) {
      if (key in data && data[key] !== undefined) {
        (this as TextConfigDTO)[key] = data[key] as never;
      }
    }
  }
}

export const textConfigState = withPersistence("text-config", new TextConfigState());
