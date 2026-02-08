import ColorPicker from "$components/ui/ColorPicker.svelte";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("ColorPicker.svelte", () => {
  it("should render with initial value", () => {
    const { container } = render(ColorPicker, {
      props: {
        value: "#ffffff",
      },
    });

    const input = container.querySelector(".color-input");
    expect(input).toBeInTheDocument();
    expect(screen.getByText("#ffffff")).toBeInTheDocument();
  });

  it("should update value on change", async () => {
    const { container } = render(ColorPicker, {
      props: {
        value: "#ffffff",
      },
    });

    const input = container.querySelector(".color-input");
    if (!input) throw new Error("Input element not found");
    await fireEvent.input(input, { target: { value: "#ff0000" } });

    expect(screen.getByText("#ff0000")).toBeInTheDocument();
  });

  it("should render with different color values", () => {
    render(ColorPicker, {
      props: {
        value: "#000000",
      },
    });

    expect(screen.getByText("#000000")).toBeInTheDocument();
  });
});
