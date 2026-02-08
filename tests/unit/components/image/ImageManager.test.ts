import ImageManager from "$components/image/ImageManager.svelte";
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("ImageManager.svelte", () => {
  it("should render without crashing", () => {
    render(ImageManager);
  });




});
