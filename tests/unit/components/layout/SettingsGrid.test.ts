import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import SettingsGridTest from "./SettingsGridTest.svelte";

describe("SettingsGrid.svelte", () => {
  it("should render without crashing", () => {
    render(SettingsGridTest);
    const settingsGrid = document.querySelector(".settings-grid");
    expect(settingsGrid).toBeInTheDocument();
  });
});
