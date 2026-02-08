import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import PageTest from "./PageTest.svelte";

describe("+page.svelte", () => {
  it("should render without crashing", () => {
    render(PageTest);
    const mainGrid = document.querySelector(".main-grid");
    expect(mainGrid).toBeInTheDocument();
  });
});
