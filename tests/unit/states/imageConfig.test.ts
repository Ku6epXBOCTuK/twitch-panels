import { PANEL_SETTINGS } from "$lib/constants";
import { imageState } from "$states/image.svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";

type ImageEventHandler = ((this: HTMLImageElement, ev?: Event) => void) | null;
type ImageErrorEventHandler =
  | ((
      this: HTMLImageElement,
      ev?: string | Event,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error,
    ) => void)
  | null;

let lastOnload: ImageEventHandler = null;
let lastOnerror: ImageErrorEventHandler = null;

vi.stubGlobal(
  "Image",
  class {
    _onload: ImageEventHandler = null;
    _onerror: ImageErrorEventHandler = null;
    _src: string = "";
    crossOrigin: string = "";

    set src(val: string) {
      this._src = val;
      if (val.includes("error")) {
        setTimeout(
          () => this._onerror?.call(this as unknown as HTMLImageElement, new Event("error")),
          1,
        );
      } else {
        setTimeout(
          () => this._onload?.call(this as unknown as HTMLImageElement, new Event("load")),
          1,
        );
      }
    }
    get src() {
      return this._src;
    }

    set onload(val: ImageEventHandler) {
      this._onload = val;
      if (val) lastOnload = val;
    }
    get onload() {
      return this._onload;
    }

    set onerror(val: ImageErrorEventHandler) {
      this._onerror = val;
      if (val) lastOnerror = val;
    }
    get onerror() {
      return this._onerror;
    }
  },
);

describe("imageState", () => {
  beforeEach(() => {
    lastOnload = null;
    lastOnerror = null;
    imageState.reset();
  });

  it("should create new instance with default values", () => {
    const newState = new imageState();
    expect(newState.image).toBeUndefined();
    expect(newState.imageLink).toBe("");
    expect(newState.imageReady).toBe(false);
    expect(newState.cropLeft).toBe(0);
    expect(newState.cropTop).toBe(0);
    expect(newState.cropRight).toBe(0);
    expect(newState.cropBottom).toBe(0);
    newState.destroy();
  });

  it("should initialize with default background image", async () => {
    await imageState.uploadImageByLink(PANEL_SETTINGS.DEFAULT_BACKGROUND_IMAGE);

    expect(imageState.imageReady).toBe(true);
    expect(imageState.image).toBeDefined();
    expect(imageState.imageLink).toBe(PANEL_SETTINGS.DEFAULT_BACKGROUND_IMAGE);
  });

  it("should handle manual image upload correctly", async () => {
    const testLink = "https://example.com/test.png";
    const uploadPromise = imageState.uploadImageByLink(testLink);

    expect(imageState.imageReady).toBe(false);

    await uploadPromise;
    expect(imageState.imageReady).toBe(true);
    expect(imageState.imageLink).toBe(testLink);
  });

  it("should reset state to defaults", async () => {
    await imageState.uploadImageByLink("some-image.png");
    imageState.cropLeft = 100;

    imageState.reset();

    expect(imageState.imageReady).toBe(false);
    expect(imageState.imageLink).toBe("");
    expect(imageState.cropLeft).toBe(0);
    expect(imageState.image).toBeUndefined();
  });

  it("should handle image loading error", async () => {
    await expect(imageState.uploadImageByLink("error-link")).rejects.toThrow(
      "Failed to load image",
    );

    expect(imageState.imageReady).toBe(false);
  });

  it("should abort previous upload when new upload starts", async () => {
    const upload1 = imageState.uploadImageByLink("test1.jpg");
    const upload2 = imageState.uploadImageByLink("test2.jpg");

    await expect(upload1).rejects.toThrow("Aborted");
    await expect(upload2).resolves.toBeUndefined();

    expect(imageState.imageLink).toBe("test2.jpg");
  });

  it("should cleanup previous image before loading new one", async () => {
    await imageState.uploadImageByLink("test1.jpg");
    const firstImage = imageState.image;

    await imageState.uploadImageByLink("test2.jpg");

    expect(firstImage?.onload).toBeNull();
    expect(firstImage?.onerror).toBeNull();
  });

  it("should set crop values", () => {
    imageState.cropLeft = 10;
    imageState.cropTop = 20;
    imageState.cropRight = 30;
    imageState.cropBottom = 40;

    expect(imageState.cropLeft).toBe(10);
    expect(imageState.cropTop).toBe(20);
    expect(imageState.cropRight).toBe(30);
    expect(imageState.cropBottom).toBe(40);
  });

  it("should cleanup image event handlers on reset", async () => {
    await imageState.uploadImageByLink("test.jpg");
    const img = imageState.image;

    imageState.reset();

    expect(img?.onload).toBeNull();
    expect(img?.onerror).toBeNull();
  });

  it("should abort ongoing upload on reset", async () => {
    const upload = imageState.uploadImageByLink("test.jpg");

    imageState.reset();

    await expect(upload).rejects.toThrow("Aborted");
  });

  it("should cleanup resources on destroy", async () => {
    await imageState.uploadImageByLink("test.jpg");
    const img = imageState.image;

    imageState.destroy();

    expect(imageState.image).toBeUndefined();
    expect(img?.onload).toBeNull();
    expect(img?.onerror).toBeNull();
  });

  it("should abort ongoing upload on destroy", async () => {
    const upload = imageState.uploadImageByLink("test.jpg");

    imageState.destroy();

    await expect(upload).rejects.toThrow("Aborted");
  });

  it("should cover aborted onload branch", async () => {
    const promise = imageState.uploadImageByLink("test.png");

    imageState.destroy();

    if (lastOnload) {
      lastOnload.call(new Image() as HTMLImageElement, new Event("load"));
    }

    await expect(promise).rejects.toThrow();
    expect(imageState.imageReady).toBe(false);
  });

  it("should cover aborted onerror branch", async () => {
    const promise = imageState.uploadImageByLink("test.png");

    imageState.destroy();

    if (lastOnerror) {
      lastOnerror.call(new Image() as HTMLImageElement, new Event("load"));
    }

    await expect(promise).rejects.toThrow();
    expect(imageState.imageReady).toBe(false);
  });
});
