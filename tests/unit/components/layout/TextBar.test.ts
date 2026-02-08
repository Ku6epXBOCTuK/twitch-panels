import TextBar from "$components/layout/TextBar.svelte";
import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("TextBar.svelte", () => {
  it("should render without crashing", () => {
    const { container } = render(TextBar);
    expect(container).toBeInTheDocument();
  });


});
