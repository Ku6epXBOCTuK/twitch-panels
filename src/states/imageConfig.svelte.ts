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
  image = $state<HTMLImageElement | undefined>(undefined);
  imageLink = $state("");
  imageReady = $state(false);
  cropLeft = $state(0);
  cropTop = $state(0);
  cropRight = $state(0);
  cropBottom = $state(0);

  #currentAbortController: AbortController | null = null;

  private cleanup() {
    if (this.#currentAbortController) {
      this.#currentAbortController.abort();
      this.#currentAbortController = null;
    }

    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
      this.image.src = "";
      this.image = undefined;
    }
  }

  async uploadImageByLink(link: string): Promise<void> {
    this.cleanup();

    this.imageReady = false;
    this.imageLink = link;

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
        this.image = img;
        this.imageReady = true;
        resolve();
      };

      img.onerror = () => {
        if (signal.aborted) return;
        onFinished();
        this.imageReady = false;
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
    this.imageLink = "";
    this.imageReady = false;
    this.cropLeft = 0;
    this.cropTop = 0;
    this.cropRight = 0;
    this.cropBottom = 0;
  }

  destroy() {
    this.cleanup();
  }
}

export const imageConfigState = new ImageConfigState();
