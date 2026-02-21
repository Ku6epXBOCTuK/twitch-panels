import PanelBar from "$components/layout/PanelBar.svelte";
import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("PanelBar.svelte", () => {
  it("should render without crashing", () => {
    const { container } = render(PanelBar);
    expect(container).toBeInTheDocument();
  });
});
