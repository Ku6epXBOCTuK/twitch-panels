import TextInput from "$components/text/TextInput.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
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
    const user = userEvent.setup();
    render(TextInput, {
      props: {
        text: "Initial",
        onenter: vi.fn(),
        ariaLabel: "Test input",
      },
    });

    const input = screen.getByRole("textbox", { name: /test input/i });
    await user.clear(input);
    await user.type(input, "Updated text");

    expect(input).toHaveValue("Updated text");
  });

  it("should call onenter only on Enter key and not on others", async () => {
    const user = userEvent.setup();
    const onenterSpy = vi.fn();

    render(TextInput, {
      props: {
        text: "test",
        onenter: onenterSpy,
        ariaLabel: "Test input",
      },
    });

    const input = screen.getByRole("textbox", { name: /test input/i });

    await user.type(input, "abc");
    expect(onenterSpy).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(onenterSpy).not.toHaveBeenCalled();

    await user.type(input, "{Enter}");
    expect(onenterSpy).toHaveBeenCalledTimes(1);
  });
});
