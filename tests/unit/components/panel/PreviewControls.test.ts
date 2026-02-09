import PreviewControls from "$components/panel/PreviewControls.svelte";
import { cleanup, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  cleanup();
});

describe("PreviewControls.svelte", () => {
  it("should render navigation buttons", () => {
    render(PreviewControls, {
      props: {
        current: 1,
        direction: "next",
        max: 3,
      },
    });

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
