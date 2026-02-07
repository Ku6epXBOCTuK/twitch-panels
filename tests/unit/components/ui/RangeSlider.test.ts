import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import RangeSlider from "$components/ui/RangeSlider.svelte";

describe("RangeSlider.svelte", () => {
  it("should render with default props", () => {
    const { container } = render(RangeSlider, {
      props: {
        value: 50,
      },
    });

    const slider = container.querySelector(".slider");
    expect(slider).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("should render with custom min, max, step", () => {
    const { container } = render(RangeSlider, {
      props: {
        value: 25,
        min: 0,
        max: 50,
        step: 5,
      },
    });

    const slider = container.querySelector(".slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "50");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("should update value on change", async () => {
    const { container } = render(RangeSlider, {
      props: {
        value: 50,
      },
    });

    const slider = container.querySelector(".slider");
    await fireEvent.input(slider, { target: { value: "75" } });

    expect(screen.getByText("75")).toBeInTheDocument();
  });

  it("should call onchange handler", async () => {
    const onchange = vi.fn();
    const { container } = render(RangeSlider, {
      props: {
        value: 50,
        onchange,
      },
    });

    const slider = container.querySelector(".slider");
    await fireEvent.change(slider, { target: { value: "75" } });

    expect(onchange).toHaveBeenCalled();
  });
});
