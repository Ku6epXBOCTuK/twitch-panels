import Preview from "$components/panel/Preview.svelte";
import { cleanup, render } from "@testing-library/svelte";
import { afterEach, describe, expect, it } from "vitest";

describe("Preview.svelte", () => {
  afterEach(() => {
    cleanup();
  });

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
