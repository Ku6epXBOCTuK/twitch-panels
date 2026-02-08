import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import TextInput from "$components/text/TextInput.svelte";

describe("TextInput.svelte", () => {
  it("should render with initial value", () => {
    const { container } = render(TextInput, {
      props: {
        text: "Test text",
        onenter: vi.fn(),
      },
    });

    const input = container.querySelector(".text-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Test text");
  });

  it("should update value on input", async () => {
    const { container } = render(TextInput, {
      props: {
        text: "Initial",
        onenter: vi.fn(),
      },
    });

    const input = container.querySelector(".text-input");
    if (!input) throw new Error("Input element not found");
    await fireEvent.input(input, { target: { value: "Updated text" } });

    expect(input).toHaveValue("Updated text");
  });

  it("should call onenter when Enter key is pressed", async () => {
    const onenter = vi.fn();
    const { container } = render(TextInput, {
      props: {
        text: "Test",
        onenter,
      },
    });

    const input = container.querySelector(".text-input");
    if (!input) throw new Error("Input element not found");
    await fireEvent.keyDown(input, { key: "Enter" });

    expect(onenter).toHaveBeenCalledTimes(1);
  });

  it("should not call onenter when other keys are pressed", async () => {
    const onenter = vi.fn();
    const { container } = render(TextInput, {
      props: {
        text: "Test",
        onenter,
      },
    });

    const input = container.querySelector(".text-input");
    if (!input) throw new Error("Input element not found");
    await fireEvent.keyDown(input, { key: "Escape" });
    await fireEvent.keyDown(input, { key: "Tab" });

    expect(onenter).not.toHaveBeenCalled();
  });

  it("should have correct placeholder", () => {
    const { container } = render(TextInput, {
      props: {
        text: "",
        onenter: vi.fn(),
      },
    });

    const input = container.querySelector(".text-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Введите текст...");
  });
});
