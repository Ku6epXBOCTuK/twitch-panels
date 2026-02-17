import SelectFont from "$components/ui/SelectFont.svelte";
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("SelectFont.svelte", () => {
  it("should render without crashing", () => {
    render(SelectFont, {
      props: {
        value: "Arial",
      },
    });
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
