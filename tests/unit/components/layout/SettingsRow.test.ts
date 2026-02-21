import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import SettingsRowTest from "./SettingsRowTest.svelte";

describe("SettingsRow.svelte", () => {
  it("should render without crashing", () => {
    render(SettingsRowTest);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });
});
