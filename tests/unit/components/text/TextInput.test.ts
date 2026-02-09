import TextInput from "$components/text/TextInput.svelte";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";

describe("TextInput.svelte", () => {
  it("should render with initial value", () => {
    render(TextInput, {
      props: {
        text: "Test text",
        onenter: vi.fn(),
        ariaLabel: "Test input",
      },
    });

    const input = screen.getByRole("textbox", { name: /test input/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Test text");
  });

  it("should update value on input", async () => {
    render(TextInput, {
      props: {
        text: "Initial",
        onenter: vi.fn(),
        ariaLabel: "Test input",
      },
    });

    const input = screen.getByRole("textbox", { name: /test input/i });
    await fireEvent.input(input, { target: { value: "Updated text" } });

    expect(input).toHaveValue("Updated text");
  });

  it("should call onenter when Enter key is pressed", async () => {
    const onenter = vi.fn();
    render(TextInput, {
      props: {
        text: "Test",
        onenter,
        ariaLabel: "Test input",
      },
    });

    const input = screen.getByRole("textbox", { name: /test input/i });
    await fireEvent.keyDown(input, { key: "Enter" });

    expect(onenter).toHaveBeenCalledTimes(1);
  });

  it("should not call onenter when other keys are pressed", async () => {
    const onenter = vi.fn();
    render(TextInput, {
      props: {
        text: "Test",
        onenter,
        ariaLabel: "Test input",
      },
    });

    const input = screen.getByRole("textbox", { name: /test input/i });
    await fireEvent.keyDown(input, { key: "Escape" });
    await fireEvent.keyDown(input, { key: "Tab" });

    expect(onenter).not.toHaveBeenCalled();
  });
});
