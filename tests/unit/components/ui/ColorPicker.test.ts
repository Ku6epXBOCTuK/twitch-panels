import ColorPicker from "$components/ui/ColorPicker.svelte";
import { render } from "@testing-library/svelte";
import { describe, it } from "vitest";

describe("ColorPicker.svelte", () => {
  it("should render without crashing", () => {
    render(ColorPicker, {
      props: {
        value: "#ffffff",
      },
    });
  });
});
