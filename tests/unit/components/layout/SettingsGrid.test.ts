import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import SettingsGridTest from "$components/layout/SettingsGridTest.svelte";

describe("SettingsGrid.svelte", () => {
  it("should render multiple children using a wrapper component", () => {
    render(SettingsGridTest);

    const settingsGrid = document.querySelector(".settings-grid");
    expect(settingsGrid).toBeInTheDocument();

    expect(screen.getByTestId("item1")).toBeInTheDocument();
    expect(screen.getByTestId("item2")).toBeInTheDocument();
    expect(screen.getByTestId("item3")).toBeInTheDocument();

    const items = settingsGrid.querySelectorAll('div[data-testid]');
    expect(items.length).toBe(3);
  });
});
