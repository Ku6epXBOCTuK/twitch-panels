import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import SettingsRowTest from "./SettingsRowTest.svelte";

describe("SettingsRow.svelte", () => {
  it("should render label and children using a wrapper component", () => {
    render(SettingsRowTest);

    const settingRow = document.querySelector(".setting-row");
    expect(settingRow).toBeInTheDocument();
    if (!settingRow) throw new Error("SettingRow element not found");

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("test-input")).toBeInTheDocument();

    const label = settingRow.querySelector(".setting-label");
    expect(label).toBeInTheDocument();
    if (!label) throw new Error("Label element not found");
    expect(label.textContent).toBe("Test Label");

    const control = settingRow.querySelector(".setting-control");
    expect(control).toBeInTheDocument();
    if (!control) throw new Error("Control element not found");
    expect(control.querySelector('input[data-testid="test-input"]')).toBeInTheDocument();
  });
});
