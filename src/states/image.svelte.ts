import { IMAGE_SETTINGS } from "$lib/constants";
import { withPersistence, type Persistable } from "./persisted.svelte";

// export const DEBOUNCE_DURATION = import.meta.env.MODE === "test" ? 0 : 200;
export const DEBOUNCE_DURATION = 150;
export const INITIAL_DELAY_DURATION = 500;

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ImageConfigDTO {
  fullImage: string | null;
  cropRect: Rect;
  brightness: number;
  contrast: number;
  hue: number;
  saturation: number;
  luminance: number;
}

const ImageConfigDTOKeys: (keyof ImageConfigDTO)[] = [
  "fullImage",
  "cropRect",
  "brightness",
  "contrast",
  "hue",
  "saturation",
  "luminance",
];

export interface ImageConfig {
  fullImage: string | null;
  croppedImage: HTMLImageElement | undefined;
  cropRect: Rect;
  brightness: number;
  contrast: number;
  hue: number;
  saturation: number;
  luminance: number;
  isReady: boolean;
  appliedFilters: FilterConfig;
}

interface FilterConfig {
  brightness: number;
  contrast: number;
  hue: number;
  saturation: number;
  luminance: number;
}

export class ImageState implements Persistable<ImageConfigDTO> {
  #fullImage: string = $state("");
  croppedImage: HTMLImageElement | undefined = $state(undefined);
  masterImage: HTMLCanvasElement | undefined = $state(undefined);
  cropRect: Rect = $state({ left: 0, top: 0, right: 0, bottom: 0 });

  brightness: number = $state(IMAGE_SETTINGS.BRIGHTNESS_DEFAULT + 1);
  contrast: number = $state(IMAGE_SETTINGS.CONTRAST_DEFAULT);
  hue: number = $state(IMAGE_SETTINGS.HUE_DEFAULT);
  saturation: number = $state(IMAGE_SETTINGS.SATURATION_DEFAULT);
  luminance: number = $state(IMAGE_SETTINGS.LUMINANCE_DEFAULT);
  isReady: boolean = $state(false);

  appliedFilters: FilterConfig = $state({
    brightness: 0,
    contrast: 0,
    hue: 0,
    saturation: 0,
    luminance: 0,
  });

  constructor() {
    $effect.root(() => {
      $effect(() => {
        const brightness = this.brightness;
        const contrast = this.contrast;
        const hue = this.hue;
        const saturation = this.saturation;
        const luminance = this.luminance;
        this.isReady = false;

        const timeout = setTimeout(() => {
          this.updateFilters({
            hue,
            saturation,
            luminance,
            brightness,
            contrast,
          });
        }, DEBOUNCE_DURATION);

        return () => clearTimeout(timeout);
      });
    });
  }

  updateFilters(newFilters: FilterConfig) {
    this.appliedFilters = newFilters;
    this.isReady = true;
  }

  reset() {
    this.#fullImage = "";
    this.croppedImage = undefined;
    this.cropRect = { left: 0, top: 0, right: 0, bottom: 0 };
    this.brightness = 0;
    this.contrast = 0;
    this.hue = 0;
  }
  get fullImage() {
    return this.#fullImage;
  }
  set fullImage(image: string) {
    if (image) {
      const img = new Image();
      img.onload = () => {
        this.#fullImage = image;
        this.croppedImage = img;
      };
      img.src = image;
    }
  }
  toSnapshot(): ImageConfigDTO {
    return {
      fullImage: this.#fullImage,
      cropRect: this.cropRect,
      brightness: this.brightness,
      contrast: this.contrast,
      hue: this.hue,
      saturation: this.saturation,
      luminance: this.luminance,
    };
  }
  fromSnapshot(data: Partial<ImageConfigDTO>): void {
    for (const key of ImageConfigDTOKeys) {
      if (key in data && data[key] !== undefined) {
        (this as ImageConfigDTO)[key] = data[key] as never;
      }
    }
  }
}

export const imageState = withPersistence("image", new ImageState());
