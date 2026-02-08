import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, it, beforeEach } from "vitest";
import { themeState } from "$states/theme.svelte";
import AppHeader from "$components/layout/AppHeader.svelte";

describe("AppHeader.svelte", () => {
  beforeEach(() => {
    themeState.theme = "dark";
  });



  it("should toggle theme on button click", async () => {
    const { container } = render(AppHeader);

    const toggleButton = container.querySelector("button");
    if (!toggleButton) throw new Error("Toggle button not found");

    themeState.theme = "dark";
    await fireEvent.click(toggleButton);
    expect(themeState.theme).toBe("light");

    await fireEvent.click(toggleButton);
    expect(themeState.theme).toBe("dark");
  });


});
