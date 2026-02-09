import TextManager from "$components/text/TextManager.svelte";
import { textsState } from "$states/texts.svelte";
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("TextManager.svelte", () => {
  beforeEach(() => {
    textsState.clear();
  });

  describe("Rendering", () => {
    it("should render card with title, input and add button", () => {
      render(TextManager);

      const cardTitle = screen.getByText("Тексты панелей");
      expect(cardTitle).toBeInTheDocument();

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();

      const addButton = screen.getByRole("button", { name: /add/i });
      expect(addButton).toBeInTheDocument();
    });

    it("should show empty list when textsState.texts is empty", () => {
      render(TextManager);

      const textItems = screen.queryAllByRole("listitem");
      expect(textItems).toHaveLength(0);
    });


  });

  describe("Adding text", () => {
    it("should call textsState.addText when add button is clicked", async () => {
      const addTextSpy = vi.spyOn(textsState, "addText");

      render(TextManager);

      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      fireEvent.input(input, { target: { value: "New text" } });
      fireEvent.click(addButton);

      expect(addTextSpy).toHaveBeenCalledWith("New text");
    });

    it("should clear input after adding text", async () => {
      render(TextManager);

      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /add/i });

      fireEvent.input(input, { target: { value: "New text" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    it("should add text when Enter key is pressed", () => {
      const addTextSpy = vi.spyOn(textsState, "addText");

      render(TextManager);

      const input = screen.getByRole("textbox");

      fireEvent.input(input, { target: { value: "New text" } });
      fireEvent.keyDown(input, { key: "Enter" });

      expect(addTextSpy).toHaveBeenCalledWith("New text");
    });


  });

  describe("List and deletion", () => {
    it("should render TextInlineEdit for each text", () => {
      textsState.addText("Text 1");
      textsState.addText("Text 2");
      textsState.addText("Text 3");

      render(TextManager);

      const textItems = screen.queryAllByRole("listitem");
      expect(textItems).toHaveLength(3);
    });

    it("should pass correct props to TextInlineEdit", () => {
      textsState.addText("Test text");
      const textId = textsState.texts[0].id;

      render(TextManager);

      const textItems = screen.queryAllByRole("listitem");
      expect(textItems).toHaveLength(1);

      const inputs = textItems[0].querySelectorAll('input[type="text"]');
      expect(inputs).toHaveLength(1);
      expect(inputs[0]).toHaveValue("Test text");
    });

    it("should call textsState.removeText when delete button is clicked", () => {
      textsState.addText("Text to delete");
      const textId = textsState.texts[0].id;
      const removeTextSpy = vi.spyOn(textsState, "removeText");

      render(TextManager);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(removeTextSpy).toHaveBeenCalledWith(textId);
    });

    it("should remove element from DOM after deletion", async () => {
      textsState.addText("Text to delete");

      render(TextManager);

      let textItems = screen.queryAllByRole("listitem");
      expect(textItems).toHaveLength(1);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        textItems = screen.queryAllByRole("listitem");
        expect(textItems).toHaveLength(0);
      });
    });
  });

  describe("Reactivity", () => {
    it("should update list when textsState.texts changes externally", async () => {
      render(TextManager);

      let textItems = screen.queryAllByRole("listitem");
      expect(textItems).toHaveLength(0);

      textsState.addText("New text");

      await waitFor(() => {
        textItems = screen.queryAllByRole("listitem");
        expect(textItems).toHaveLength(1);
      });
    });

    it("should update when text is removed externally", async () => {
      vi.useFakeTimers();

      textsState.addText("Text to remove");
      const textId = textsState.texts[0].id;

      render(TextManager);

      await waitFor(() => {
        expect(screen.queryAllByRole("listitem")).toHaveLength(1);
      });

      textsState.removeText(textId);
      await vi.advanceTimersByTimeAsync(400);

      await waitFor(() => {
        expect(screen.queryAllByRole("listitem")).toHaveLength(0);
      });
      vi.useRealTimers();
    });
  });

  describe("Accessibility", () => {
    // it("should keep focus in input after adding text", async () => {
    //   render(TextManager);
    //   const input = screen.getByRole("textbox");
    //   const addButton = screen.getByRole("button", { name: /add/i });
    //   fireEvent.input(input, { target: { value: "New text" } });
    //   fireEvent.click(addButton);
    //   await waitFor(() => {
    //     expect(input).toHaveFocus();
    //   });
    // });

    it("should have proper aria-labels for input and button", () => {
      render(TextManager);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Input new text");
      const addButton = screen.getByRole("button", { name: /add/i });
      expect(addButton).toHaveAttribute("aria-label", "Add text");
    });
  });
});
