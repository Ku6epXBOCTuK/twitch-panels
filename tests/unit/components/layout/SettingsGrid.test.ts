import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SettingsGridTest from "./SettingsGridTest.svelte";

describe("SettingsGrid.svelte", () => {
  describe("initial state", () => {
    it("should render with collapsed state by default", () => {
      render(SettingsGridTest);
      expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
      expect(screen.queryByText("Item 3")).not.toBeInTheDocument();
    });

    it("should display the label", () => {
      render(SettingsGridTest);
      expect(screen.getByText("Test Grid")).toBeInTheDocument();
    });

    it("should render expand button", () => {
      render(SettingsGridTest);
      const expandButton = screen.getByRole("button", { name: "Expand" });
      expect(expandButton).toBeInTheDocument();
    });
  });

  describe("expand/collapse behavior", () => {
    it("should show children when expand button is clicked", async () => {
      const user = userEvent.setup();
      render(SettingsGridTest);
      const expandButton = screen.getByRole("button", { name: "Expand" });
      await user.click(expandButton);
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should hide children when expand button is clicked twice", async () => {
      const user = userEvent.setup();
      render(SettingsGridTest);
      const expandButton = screen.getByRole("button", { name: "Expand" });
      await user.click(expandButton);
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      await user.click(expandButton);
      expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    });
  });
});
