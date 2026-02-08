import TextInlineEdit from "$components/text/TextInlineEdit.svelte";
import { render, cleanup } from "@testing-library/svelte";
import { describe, expect, it, afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

describe("TextInlineEdit.svelte", () => {
  it("should render with initial text", () => {
    render(TextInlineEdit, {
      props: {
        id: 1,
        text: "Test text",
        ondelete: () => {},
      },
    });

    const input = document.querySelector("input[type='text']");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Test text");
  });

  it("should render delete button", () => {
    render(TextInlineEdit, {
      props: {
        id: 1,
        text: "Test",
        ondelete: () => {},
      },
    });

    const deleteBtn = document.querySelector("button");
    expect(deleteBtn).toBeInTheDocument();
  });

  it("should have text-item class", () => {
    render(TextInlineEdit, {
      props: {
        id: 1,
        text: "Test",
        ondelete: () => {},
      },
    });

    const textItem = document.querySelector(".text-item");
    expect(textItem).toBeInTheDocument();
  });

  it("should render with empty text", () => {
    render(TextInlineEdit, {
      props: {
        id: 1,
        text: "",
        ondelete: () => {},
      },
    });

    const input = document.querySelector("input[type='text']");
    expect(input).toHaveValue("");
  });
});
