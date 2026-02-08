import AppHeader from "$components/layout/AppHeader.svelte";
import { themeState } from "$states/theme.svelte";
import { fireEvent, render } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";

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
