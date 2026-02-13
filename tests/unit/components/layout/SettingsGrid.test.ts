import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import SettingsGridTest from "./SettingsGridTest.svelte";

describe("SettingsGrid.svelte", () => {
  it("should render without crashing", () => {
    render(SettingsGridTest);
    expect(screen.getByTestId("item1")).toBeInTheDocument();
    expect(screen.getByTestId("item2")).toBeInTheDocument();
    expect(screen.getByTestId("item3")).toBeInTheDocument();
  });
});
