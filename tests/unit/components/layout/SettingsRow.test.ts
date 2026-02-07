import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import SettingsRowTest from "$components/layout/SettingsRowTest.svelte";

describe("SettingsRow.svelte", () => {
  it("should render label and children using a wrapper component", () => {
    render(SettingsRowTest);

    const settingRow = document.querySelector(".setting-row");
    expect(settingRow).toBeInTheDocument();

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("test-input")).toBeInTheDocument();

    const label = settingRow.querySelector(".setting-label");
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe("Test Label");

    const control = settingRow.querySelector(".setting-control");
    expect(control).toBeInTheDocument();
    expect(control.querySelector('input[data-testid="test-input"]')).toBeInTheDocument();
  });
});
