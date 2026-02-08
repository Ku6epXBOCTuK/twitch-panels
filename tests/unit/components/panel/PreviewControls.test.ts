import PreviewControls from "$components/panel/PreviewControls.svelte";
import { render, screen, cleanup } from "@testing-library/svelte";
import { describe, expect, it, afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

describe("PreviewControls.svelte", () => {
  it("should render with default values", () => {
    render(PreviewControls, {
      props: {
        current: 0,
        direction: "next",
        max: 3,
      },
    });

    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("should render navigation buttons", () => {
    render(PreviewControls, {
      props: {
        current: 1,
        direction: "next",
        max: 3,
      },
    });

    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBe(2);
  });

  it("should disable prev button when at first slide", () => {
    render(PreviewControls, {
      props: {
        current: 0,
        direction: "next",
        max: 3,
      },
    });

    const buttons = document.querySelectorAll("button");
    expect(buttons[0]).toBeDisabled();
  });

  it("should disable next button when at last slide", () => {
    render(PreviewControls, {
      props: {
        current: 2,
        direction: "next",
        max: 3,
      },
    });

    const buttons = document.querySelectorAll("button");
    expect(buttons[1]).toBeDisabled();
  });

  it("should have panel-indicator element", () => {
    render(PreviewControls, {
      props: {
        current: 0,
        direction: "next",
        max: 3,
      },
    });

    const indicator = document.querySelector(".panel-indicator");
    expect(indicator).toBeInTheDocument();
  });
});
