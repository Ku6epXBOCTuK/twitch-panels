import { imageState } from "$states/image.svelte";
import { afterEach, describe, expect, it } from "vitest";

describe("imageState", () => {
  afterEach(() => {
    imageState.reset();
  });

  it("should create new instance with default values", () => {
    expect(imageState.fullImage).toBe("");
    expect(imageState.croppedImage).toBeUndefined();
    expect(imageState.cropRect).toStrictEqual({ left: 0, top: 0, right: 0, bottom: 0 });
  });
});
