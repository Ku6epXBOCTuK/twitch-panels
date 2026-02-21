import TextConfig from "$components/text/TextConfig.svelte";
import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("TextConfig.svelte", () => {
  it("should render without crashing", () => {
    const { container } = render(TextConfig);

    expect(container).toBeTruthy();
  });
});
