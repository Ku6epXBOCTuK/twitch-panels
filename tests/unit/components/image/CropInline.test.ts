import CropInline from "$components/image/CropInline.svelte";
import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("CropInline.svelte", () => {
  it("should render without crashing", () => {
    const { container } = render(CropInline);
    expect(container).toBeInTheDocument();
  });

  it("should render canvas element", () => {
    const { container } = render(CropInline);
    const canvas = container.querySelector("canvas.crop-canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should render crop-box element", () => {
    const { container } = render(CropInline);
    const cropBox = container.querySelector(".crop-box");
    expect(cropBox).toBeInTheDocument();
  });

  it("should render 8 crop handles", () => {
    const { container } = render(CropInline);
    const handles = container.querySelectorAll(".crop-handle");
    expect(handles).toHaveLength(8);
  });

  it("should have crop-canvas-container wrapper", () => {
    const { container } = render(CropInline);
    const wrapper = container.querySelector(".crop-canvas-container");
    expect(wrapper).toBeInTheDocument();
  });
});
