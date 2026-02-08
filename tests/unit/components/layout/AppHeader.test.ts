import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, it, beforeEach } from "vitest";
import { themeState } from "$states/theme.svelte";
import AppHeader from "$components/layout/AppHeader.svelte";

describe("AppHeader.svelte", () => {
  beforeEach(() => {
    themeState.theme = "dark";
  });

  it("should render header with title", () => {
    render(AppHeader);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Twitch Panels")).toBeInTheDocument();
  });

  it("should render theme toggle button", () => {
    const { container } = render(AppHeader);

    const toggleButton = container.querySelector(".theme-toggle");
    expect(toggleButton).toBeInTheDocument();
  });

  it("should toggle theme on button click", async () => {
    const { container } = render(AppHeader);

    const toggleButton = container.querySelector(".theme-toggle");
    if (!toggleButton) throw new Error("Toggle button not found");

    themeState.theme = "dark";
    await fireEvent.click(toggleButton);
    expect(themeState.theme).toBe("light");

    await fireEvent.click(toggleButton);
    expect(themeState.theme).toBe("dark");
  });

  it("should have correct aria-label on toggle button", () => {
    const { container } = render(AppHeader);

    const toggleButton = container.querySelector(".theme-toggle");
    expect(toggleButton).toHaveAttribute("aria-label", "Toggle theme");
  });
});
