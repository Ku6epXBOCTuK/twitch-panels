import { PANEL_SETTINGS } from "$lib/constants";
import { imageConfigState, ImageConfigState } from "$states/imageConfig.svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";

let lastOnload: (() => void) | null = null;
let lastOnerror: (() => void) | null = null;

vi.stubGlobal(
  "Image",
  class {
    _onload: (() => void) | null = null;
    _onerror: (() => void) | null = null;
    _src: string = "";
    crossOrigin: string = "";

    set src(val: string) {
      this._src = val;
      if (val.includes("error")) {
        setTimeout(() => this._onerror?.(), 1);
      } else {
        setTimeout(() => this._onload?.(), 1);
      }
    }
    get src() {
      return this._src;
    }

    set onload(val: any) {
      this._onload = val;
      if (val) lastOnload = val;
    }
    get onload() {
      return this._onload;
    }

    set onerror(val: any) {
      this._onerror = val;
      if (val) lastOnerror = val;
    }
    get onerror() {
      return this._onerror;
    }
  },
);

describe("ImageConfigState", () => {
  beforeEach(() => {
    lastOnload = null;
    lastOnerror = null;
    imageConfigState.reset();
  });

  it("should create new instance with default values", () => {
    const newState = new ImageConfigState();
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
    await imageConfigState.uploadImageByLink(PANEL_SETTINGS.DEFAULT_BACKGROUND_IMAGE);

    expect(imageConfigState.imageReady).toBe(true);
    expect(imageConfigState.image).toBeDefined();
    expect(imageConfigState.imageLink).toBe(PANEL_SETTINGS.DEFAULT_BACKGROUND_IMAGE);
  });

  it("should handle manual image upload correctly", async () => {
    const testLink = "https://example.com/test.png";
    const uploadPromise = imageConfigState.uploadImageByLink(testLink);

    expect(imageConfigState.imageReady).toBe(false);

    await uploadPromise;
    expect(imageConfigState.imageReady).toBe(true);
    expect(imageConfigState.imageLink).toBe(testLink);
  });

  it("should reset state to defaults", async () => {
    await imageConfigState.uploadImageByLink("some-image.png");
    imageConfigState.cropLeft = 100;

    imageConfigState.reset();

    expect(imageConfigState.imageReady).toBe(false);
    expect(imageConfigState.imageLink).toBe("");
    expect(imageConfigState.cropLeft).toBe(0);
    expect(imageConfigState.image).toBeUndefined();
  });

  it("should handle image loading error", async () => {
    await expect(imageConfigState.uploadImageByLink("error-link")).rejects.toThrow("Failed to load image");

    expect(imageConfigState.imageReady).toBe(false);
  });

  it("should abort previous upload when new upload starts", async () => {
    const upload1 = imageConfigState.uploadImageByLink("test1.jpg");
    const upload2 = imageConfigState.uploadImageByLink("test2.jpg");

    await expect(upload1).rejects.toThrow("Aborted");
    await expect(upload2).resolves.toBeUndefined();

    expect(imageConfigState.imageLink).toBe("test2.jpg");
  });

  it("should cleanup previous image before loading new one", async () => {
    await imageConfigState.uploadImageByLink("test1.jpg");
    const firstImage = imageConfigState.image;

    await imageConfigState.uploadImageByLink("test2.jpg");

    expect(firstImage?.onload).toBeNull();
    expect(firstImage?.onerror).toBeNull();
  });

  it("should set crop values", () => {
    imageConfigState.cropLeft = 10;
    imageConfigState.cropTop = 20;
    imageConfigState.cropRight = 30;
    imageConfigState.cropBottom = 40;

    expect(imageConfigState.cropLeft).toBe(10);
    expect(imageConfigState.cropTop).toBe(20);
    expect(imageConfigState.cropRight).toBe(30);
    expect(imageConfigState.cropBottom).toBe(40);
  });

  it("should cleanup image event handlers on reset", async () => {
    await imageConfigState.uploadImageByLink("test.jpg");
    const img = imageConfigState.image;

    imageConfigState.reset();

    expect(img?.onload).toBeNull();
    expect(img?.onerror).toBeNull();
  });

  it("should abort ongoing upload on reset", async () => {
    const upload = imageConfigState.uploadImageByLink("test.jpg");

    imageConfigState.reset();

    await expect(upload).rejects.toThrow("Aborted");
  });

  it("should cleanup resources on destroy", async () => {
    await imageConfigState.uploadImageByLink("test.jpg");
    const img = imageConfigState.image;

    imageConfigState.destroy();

    expect(imageConfigState.image).toBeUndefined();
    expect(img?.onload).toBeNull();
    expect(img?.onerror).toBeNull();
  });

  it("should abort ongoing upload on destroy", async () => {
    const upload = imageConfigState.uploadImageByLink("test.jpg");

    imageConfigState.destroy();

    await expect(upload).rejects.toThrow("Aborted");
  });

  it("should cover aborted onload branch", async () => {
    const promise = imageConfigState.uploadImageByLink("test.png");

    imageConfigState.destroy();

    if (lastOnload) lastOnload();

    await expect(promise).rejects.toThrow();
    expect(imageConfigState.imageReady).toBe(false);
  });

  it("should cover aborted onerror branch", async () => {
    const promise = imageConfigState.uploadImageByLink("test.png");

    imageConfigState.destroy();

    if (lastOnerror) lastOnerror();

    await expect(promise).rejects.toThrow();
    expect(imageConfigState.imageReady).toBe(false);
  });
});
