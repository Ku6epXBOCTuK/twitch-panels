import Preview from "$components/panel/Preview.svelte";
import { render, cleanup } from "@testing-library/svelte";
import { describe, expect, it, afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

describe("Preview.svelte", () => {
  it("should render without crashing", () => {
    const { container } = render(Preview, {
      props: {
        text: "Test text",
        stage: undefined,
      },
    });

    expect(container).toBeInTheDocument();
  });

  it("should have stage element", () => {
    const { container } = render(Preview, {
      props: {
        text: "Test",
        stage: undefined,
      },
    });

    const stage = container.querySelector("canvas");
    expect(stage).toBeInTheDocument();
  });


});
