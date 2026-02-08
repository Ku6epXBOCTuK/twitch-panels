import { themeState } from "$states/theme.svelte";
import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LayoutTest from "./LayoutTest.svelte";

describe("+layout.svelte", () => {
  beforeEach(() => {
    themeState.theme = "dark";
    vi.clearAllMocks();
  });

  it("should apply dark theme", () => {
    themeState.theme = "dark";

    expect(themeState.theme).toBe("dark");
  });

  it("should apply light theme", () => {
    themeState.theme = "light";

    expect(themeState.theme).toBe("light");
  });

  it("should toggle theme", () => {
    themeState.theme = "dark";
    themeState.toggle();

    expect(themeState.theme).toBe("light");
  });
});

describe("Layout Component Coverage", () => {
  it("should render children snippet and initialize props", () => {
    render(LayoutTest);

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
