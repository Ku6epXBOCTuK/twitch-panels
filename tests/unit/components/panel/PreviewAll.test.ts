import PreviewAll from "$components/panel/PreviewAll.svelte";
import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("PreviewAll.svelte", () => {
  it("should render without crashing", () => {
    const { container } = render(PreviewAll);

    expect(container).toBeTruthy();
  });
});
