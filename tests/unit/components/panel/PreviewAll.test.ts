import PreviewAll from "$components/panel/PreviewAll.svelte";
import { textsState } from "$states/texts.svelte";
import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";

describe("PreviewAll.svelte", () => {
  beforeEach(() => {
    textsState.texts.length = 0;
  });

  it("should render empty state message when no texts", () => {
    render(PreviewAll);
    expect(screen.getByText("No texts to preview")).toBeInTheDocument();
  });

  it("should have outside-display container", () => {
    render(PreviewAll);
    const container = document.querySelector(".outside-display");
    expect(container).toBeInTheDocument();
  });
});
