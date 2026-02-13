import AppHeader from "$components/layout/AppHeader.svelte";
import { themeState } from "$states/theme.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

describe("AppHeader.svelte", () => {
  beforeEach(() => {
    themeState.current = "dark";
  });

  it("should toggle theme on button click", async () => {
    const user = userEvent.setup();
    render(AppHeader);

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    themeState.current = "dark";
    await user.click(toggleButton);
    expect(themeState.current).toBe("light");

    await user.click(toggleButton);
    expect(themeState.current).toBe("dark");
  });
});
