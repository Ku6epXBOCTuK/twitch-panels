import { SlideDirection } from "$lib/constants";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PreviewControlsTest from "./PreviewControlsTest.svelte";

describe("PreviewControls logic", () => {
  it("should increment current and update direction on next click", async () => {
    const user = userEvent.setup();
    render(PreviewControlsTest, { props: { current: 0, max: 3 } });

    const nextBtn = screen.getByRole("button", { name: /next slide/i });

    await user.click(nextBtn);

    expect(screen.getByTestId("current").textContent).toBe("1");
    expect(screen.getByTestId("direction").textContent).toBe(SlideDirection.NEXT);
  });

  it("should decrement current on prev click", async () => {
    const user = userEvent.setup();
    render(PreviewControlsTest, { props: { current: 2, max: 3 } });

    const prevBtn = screen.getByRole("button", { name: /previous slide/i });

    await user.click(prevBtn);

    expect(screen.getByTestId("current").textContent).toBe("1");
  });

  it("should handle boundaries and disable buttons", async () => {
    const user = userEvent.setup();
    render(PreviewControlsTest, { props: { current: 0, max: 2 } });

    const prevBtn = screen.getByRole("button", { name: /previous slide/i });
    const nextBtn = screen.getByRole("button", { name: /next slide/i });

    expect(prevBtn).toBeDisabled();

    await user.click(nextBtn);

    expect(screen.getByTestId("current").textContent).toBe("1");
    expect(nextBtn).toBeDisabled();
    expect(prevBtn).not.toBeDisabled();
  });
});
