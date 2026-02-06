export type ImageConfig = {
  image: HTMLImageElement | undefined;
  imageLink: string;
  imageReady: boolean;
  cropLeft: number;
  cropTop: number;
  cropRight: number;
  cropBottom: number;
};

async function createState() {
  const defaults: ImageConfig = {
    image: undefined,
    imageLink: "",
    imageReady: false,
    cropLeft: 0,
    cropTop: 0,
    cropRight: 0,
    cropBottom: 0,
  };

  let state: ImageConfig = $state({ ...defaults });
  let currentAbortController: AbortController | null = null;

  function cleanup() {
    if (currentAbortController) {
      currentAbortController.abort();
      currentAbortController = null;
    }

    if (state.image) {
      state.image.onload = null;
      state.image.onerror = null;
      state.image.src = "";
      state.image = undefined;
    }
  }

  async function uploadImageByLink(link: string): Promise<void> {
    cleanup();

    state.imageReady = false;
    state.imageLink = link;

    currentAbortController = new AbortController();
    const { signal } = currentAbortController;

    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (signal.aborted) return;

        img.onload = null;
        img.onerror = null;

        state.image = img;
        state.imageReady = true;
        resolve();
      };

      img.onerror = (error) => {
        if (signal.aborted) return;

        img.onload = null;
        img.onerror = null;
        img.src = "";

        state.imageReady = false;
        reject(new Error(`Failed to load image: ${link}`));
      };

      signal.addEventListener(
        "abort",
        () => {
          img.onload = null;
          img.onerror = null;
          img.src = "";
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true },
      );

      img.src = link;
    });
  }

  await uploadImageByLink("./backgrounds/b1.jpg");

  return {
    get image() {
      return state.image;
    },
    get imageReady() {
      return state.imageReady;
    },
    get imageLink() {
      return state.imageLink;
    },

    uploadImageByLink,

    reset() {
      cleanup();
      Object.assign(state, defaults);
    },

    destroy() {
      cleanup();
    },
  };
}

export const imageConfigState = await createState();
