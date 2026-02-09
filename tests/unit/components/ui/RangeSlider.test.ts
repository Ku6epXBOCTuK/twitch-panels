import RangeSlider from "$components/ui/RangeSlider.svelte";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";

describe("RangeSlider.svelte", () => {
  it("should call onchange handler", async () => {
    const onchange = vi.fn();
    render(RangeSlider, {
      props: {
        value: 50,
        onchange,
      },
    });

    const slider = screen.getByRole("slider");
    await fireEvent.change(slider, { target: { value: "75" } });

    expect(onchange).toHaveBeenCalledTimes(1);
  });
});
