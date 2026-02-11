import TextManager from "$components/text/TextManager.svelte";
import { textsState } from "$states/texts.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

describe("TextManager", () => {
  beforeEach(() => {
    textsState.clear();
  });

  it("should add text to state and clear input on button click", async () => {
    const user = userEvent.setup();
    render(TextManager);

    const input = screen.getByRole("textbox", { name: /input new text/i });
    const addButton = screen.getByRole("button", { name: /add text/i });

    await user.type(input, "New Note");
    await user.click(addButton);

    expect(textsState.texts).toHaveLength(1);
    expect(textsState.texts[0].text).toBe("New Note");
    expect(input).toHaveValue("");
  });

  it("should add text on enter key", async () => {
    const user = userEvent.setup();
    render(TextManager);

    const input = screen.getByRole("textbox", { name: /input new text/i });

    await user.type(input, "Enter Note{Enter}");

    expect(textsState.texts).toHaveLength(1);
    expect(textsState.texts[0].text).toBe("Enter Note");
  });

  it("should display all items from state", async () => {
    textsState.addText("First");
    textsState.addText("Second");

    render(TextManager);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
  });

  it("should remove text from state when delete button is clicked", async () => {
    const user = userEvent.setup();
    textsState.addText("To be deleted");

    render(TextManager);

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);

    expect(textsState.texts).toHaveLength(0);
  });
});
