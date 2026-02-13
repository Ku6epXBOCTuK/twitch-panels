import TextConfig from "$components/text/TextConfig.svelte";
import { cleanup, render } from "@testing-library/svelte";
import { afterEach, describe, it } from "vitest";

afterEach(() => {
  cleanup();
});

describe("TextConfig.svelte", () => {
  it("should render without crashing", () => {
    render(TextConfig);
  });
});
