import { PANEL_SETTINGS } from "$lib/constants";

export type ImageConfig = {
  image: HTMLImageElement | undefined;
  imageLink: string;
  imageReady: boolean;
  cropLeft: number;
  cropTop: number;
  cropRight: number;
  cropBottom: number;
};

export class ImageConfigState {
  #state: ImageConfig = $state({
    image: undefined,
    imageLink: "",
    imageReady: false,
    cropLeft: 0,
    cropTop: 0,
    cropRight: 0,
    cropBottom: 0,
  });

  #currentAbortController: AbortController | null = null;

  get image() {
    return this.#state.image;
  }
  get imageReady() {
    return this.#state.imageReady;
  }
  get imageLink() {
    return this.#state.imageLink;
  }
  get cropLeft() {
    return this.#state.cropLeft;
  }
  get cropTop() {
    return this.#state.cropTop;
  }
  get cropRight() {
    return this.#state.cropRight;
  }
  get cropBottom() {
    return this.#state.cropBottom;
  }

  set cropLeft(v) {
    this.#state.cropLeft = v;
  }
  set cropTop(v) {
    this.#state.cropTop = v;
  }
  set cropRight(v) {
    this.#state.cropRight = v;
  }
  set cropBottom(v) {
    this.#state.cropBottom = v;
  }

  private cleanup() {
    if (this.#currentAbortController) {
      this.#currentAbortController.abort();
      this.#currentAbortController = null;
    }

    if (this.#state.image) {
      this.#state.image.onload = null;
      this.#state.image.onerror = null;
      this.#state.image.src = "";
      this.#state.image = undefined;
    }
  }

  async uploadImageByLink(link: string): Promise<void> {
    this.cleanup();

    this.#state.imageReady = false;
    this.#state.imageLink = link;

    this.#currentAbortController = new AbortController();
    const { signal } = this.#currentAbortController;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const onFinished = () => {
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        if (signal.aborted) return;
        onFinished();
        this.#state.image = img;
        this.#state.imageReady = true;
        resolve();
      };

      img.onerror = () => {
        if (signal.aborted) return;
        onFinished();
        this.#state.imageReady = false;
        reject(new Error(`Failed to load image: ${link}`));
      };

      signal.addEventListener(
        "abort",
        () => {
          onFinished();
          img.src = "";
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true },
      );

      img.src = link;
    });
  }

  reset() {
    this.cleanup();
    this.#state.imageLink = "";
    this.#state.imageReady = false;
    this.#state.cropLeft = 0;
    this.#state.cropTop = 0;
    this.#state.cropRight = 0;
    this.#state.cropBottom = 0;
  }

  destroy() {
    this.cleanup();
  }
}

export const imageConfigState = new ImageConfigState();
imageConfigState.uploadImageByLink(PANEL_SETTINGS.DEFAULT_BACKGROUND_IMAGE).catch(() => {});
