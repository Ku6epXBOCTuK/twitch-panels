import ImageManager from "$components/image/ImageManager.svelte";
import { render } from "@testing-library/svelte";
import { describe, it } from "vitest";

describe("ImageManager.svelte", () => {
  it("should render without crashing", () => {
    render(ImageManager);
  });
});
