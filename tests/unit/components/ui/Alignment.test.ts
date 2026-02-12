import { TextAlign } from "$lib/constants";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AlignmentTest from "./AlignmentTest.svelte";

describe("Alignment.svelte", () => {
  it("should update state for every button by clicking in sequence", async () => {
    const user = userEvent.setup();
    render(AlignmentTest);

    const buttons = screen.getAllByRole("radio");
    const stateDisplay = screen.getByTestId("align-value");

    const allButtonsToClick = [...buttons, buttons[0]];

    for (const button of allButtonsToClick) {
      const label = button.getAttribute("aria-label")?.toLowerCase() || "";

      await user.click(button);

      const finalValue = stateDisplay.textContent?.toLowerCase() || "";
      expect(label).toContain(finalValue);
    }
  });

  it("should have initial state from props", () => {
    render(AlignmentTest, { props: { align: TextAlign.RIGHT } });
    expect(screen.getByTestId("align-value").textContent).toBe(TextAlign.RIGHT);
  });

  it("should sync with initial state and change state", async () => {
    const user = userEvent.setup();
    const { rerender } = render(AlignmentTest, { props: { align: TextAlign.RIGHT } });
    const stateDisplay = screen.getByTestId("align-value");

    expect(stateDisplay.textContent).toBe(TextAlign.RIGHT);

    await rerender({ align: TextAlign.CENTER });

    const centerBtn = screen.getByRole("radio", { name: new RegExp(TextAlign.CENTER, "i") });
    expect(centerBtn).toBeChecked();
  });
});
