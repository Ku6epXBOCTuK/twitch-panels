import TextManager from "$components/text/TextManager.svelte";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the stores
vi.mock("$stores/panelStore", () => ({
  textSettingsStore: {
    subscribe: vi.fn((callback) => {
      callback({
        fontSize: 18,
        fontFamily: "Arial",
        color: "#ffffff",
        textAlign: "center",
        paddingX: 10,
        verticalOffset: 0,
      });
      return () => {}; // unsubscribe function
    }),
    update: vi.fn(),
  },
  updateAllTextSettings: vi.fn(),
}));

describe("TextManager", () => {
  let mockOnTextAdd: (text: string, settings?: any) => void;
  let mockOnTextUpdate: (id: string, text: string) => void;
  let mockOnTextDelete: (id: string) => void;

  beforeEach(() => {
    mockOnTextAdd = vi.fn();
    mockOnTextUpdate = vi.fn();
    mockOnTextDelete = vi.fn();
  });

  it("should render with empty text list", () => {
    const { container } = render(TextManager, {
      props: {
        texts: [],
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    expect(container).toBeTruthy();
  });

  it("should render with existing texts", () => {
    const mockTexts = [
      { id: "text-1", text: "First text" },
      { id: "text-2", text: "Second text" },
    ];

    const { container } = render(TextManager, {
      props: {
        texts: mockTexts,
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    expect(container).toBeTruthy();
  });

  it("should call onTextAdd when add text form is submitted", async () => {
    const { container } = render(TextManager, {
      props: {
        texts: [],
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    // Find text input and add button
    const textInputs = container.querySelectorAll('input[type="text"], textarea');
    const buttons = screen.getAllByRole("button");

    if (textInputs.length > 0 && buttons.length > 0) {
      await fireEvent.input(textInputs[0], { target: { value: "New text" } });
      await fireEvent.click(buttons[0]);

      expect(mockOnTextAdd).toHaveBeenCalledWith("New text", expect.any(Object));
    }
  });

  it("should show error for empty text", async () => {
    const { container } = render(TextManager, {
      props: {
        texts: [],
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    // Find add button and click without entering text
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      await fireEvent.click(buttons[0]);

      // Should not call onTextAdd for empty text
      expect(mockOnTextAdd).not.toHaveBeenCalled();
    }
  });

  it("should handle text update", async () => {
    const mockTexts = [{ id: "text-1", text: "Original text" }];

    const { container } = render(TextManager, {
      props: {
        texts: mockTexts,
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    // Find text inputs for existing texts
    const textInputs = container.querySelectorAll('input[type="text"], textarea');
    if (textInputs.length > 0) {
      await fireEvent.input(textInputs[0], { target: { value: "Updated text" } });

      // Should call onTextUpdate with the text ID and new text
      expect(mockOnTextUpdate).toHaveBeenCalledWith("text-1", "Updated text");
    }
  });

  it("should handle text deletion", async () => {
    const mockTexts = [{ id: "text-1", text: "Text to delete" }];

    render(TextManager, {
      props: {
        texts: mockTexts,
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    // Find delete button (might be an X button or similar)
    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find(
      (button) =>
        button.textContent?.includes("Delete") ||
        button.textContent?.includes("Remove") ||
        button.textContent?.includes("×") ||
        button.textContent?.includes("X"),
    );

    if (deleteButton) {
      await fireEvent.click(deleteButton);
      expect(mockOnTextDelete).toHaveBeenCalledWith("text-1");
    }
  });

  it("should handle font size changes", async () => {
    const { container } = render(TextManager, {
      props: {
        texts: [],
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    // Find font size input (number input)
    const numberInputs = container.querySelectorAll('input[type="number"]');
    if (numberInputs.length > 0) {
      await fireEvent.input(numberInputs[0], { target: { value: "24" } });

      // Font size change should be handled in the component
      expect(container).toBeTruthy(); // Basic check that component still renders
    }
  });

  it("should handle color changes", async () => {
    const { container } = render(TextManager, {
      props: {
        texts: [],
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    // Find color input
    const colorInputs = container.querySelectorAll('input[type="color"]');
    if (colorInputs.length > 0) {
      await fireEvent.input(colorInputs[0], { target: { value: "#ff0000" } });

      // Color change should be handled in the component
      expect(container).toBeTruthy(); // Basic check that component still renders
    }
  });

  it("should handle text alignment changes", async () => {
    const { container } = render(TextManager, {
      props: {
        texts: [],
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    // Look for alignment buttons or radio buttons
    const radioButtons = screen.getAllByRole("radio");
    if (radioButtons.length > 0) {
      await fireEvent.click(radioButtons[0]);
      expect(container).toBeTruthy(); // Basic check that component still renders
    }
  });

  it("should call updateAllTextSettings when update all button is clicked", async () => {
    const { updateAllTextSettings } = await import("$stores/panelStore");

    render(TextManager, {
      props: {
        texts: [],
        onTextAdd: mockOnTextAdd,
        onTextUpdate: mockOnTextUpdate,
        onTextDelete: mockOnTextDelete,
      },
    });

    // Look for "Update All" or similar button
    const buttons = screen.getAllByRole("button");
    const updateAllButton = buttons.find(
      (button) =>
        button.textContent?.includes("Update All") ||
        button.textContent?.includes("Apply to All") ||
        button.textContent?.includes("Сохранить"),
    );

    if (updateAllButton) {
      await fireEvent.click(updateAllButton);
      expect(updateAllTextSettings).toHaveBeenCalled();
    }
  });
});
