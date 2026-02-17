import ColorPicker from "$components/ui/ColorPicker.svelte";
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("ColorPicker.svelte", () => {
  it("should render without crashing", () => {
    render(ColorPicker, {
      props: {
        value: "#ffffff",
      },
    });
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
