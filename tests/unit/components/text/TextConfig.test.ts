import TextConfig from "$components/text/TextConfig.svelte";
import { render, screen, cleanup } from "@testing-library/svelte";
import { describe, expect, it, afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

describe("TextConfig.svelte", () => {
  it("should render without crashing", () => {
    render(TextConfig);
  });




});
