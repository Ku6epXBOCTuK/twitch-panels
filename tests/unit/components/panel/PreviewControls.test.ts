import PreviewControls from "$components/panel/PreviewControls.svelte";
import { render, screen, cleanup } from "@testing-library/svelte";
import { describe, expect, it, afterEach } from "vitest";

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

    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });




});
