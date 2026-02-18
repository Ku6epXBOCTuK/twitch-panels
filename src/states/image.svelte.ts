export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export type ImageConfig = {
  fullImage: string | null;
  croppedImage: HTMLImageElement | undefined;
  cropRect: Rect;
};

function createState(): ImageConfig & { reset: () => void } {
  let fullImage = $state<string | null>(null);
  let croppedImage = $state<HTMLImageElement | undefined>(undefined);
  let crop: Rect = $state({ left: 0, top: 0, right: 0, bottom: 0 });

  return {
    get fullImage(): string | null {
      return fullImage;
    },
    set fullImage(image: string) {
      if (image) {
        const img = new Image();
        img.onload = () => {
          fullImage = image;
          croppedImage = img;
        };
        img.src = image;
      }
    },
    get croppedImage() {
      return croppedImage;
    },
    get cropRect() {
      return crop;
    },
    set cropRect(rect: Rect) {
      crop = rect;
    },
    reset() {
      fullImage = null;
      croppedImage = undefined;
      crop = { left: 0, top: 0, right: 0, bottom: 0 };
    },
  };
}

export const imageState = createState();
