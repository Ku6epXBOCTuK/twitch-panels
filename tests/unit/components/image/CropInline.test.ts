import CropInline from "$components/image/CropInline.svelte";
import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("CropInline.svelte", () => {
  it("should render without crashing", () => {
    const { container } = render(CropInline);
    expect(container).toBeInTheDocument();
  });
});
