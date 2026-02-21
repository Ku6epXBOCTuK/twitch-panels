import TextInlineEdit from "$components/text/TextInlineEdit.svelte";
import { cleanup, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, it } from "vitest";

describe("TextInlineEdit.svelte", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render with initial text", () => {
    render(TextInlineEdit, {
      props: {
        id: 1,
        text: "Test text",
        ondelete: () => {},
      },
    });

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Test text");
  });

  it("should render with empty text", () => {
    render(TextInlineEdit, {
      props: {
        id: 1,
        text: "",
        ondelete: () => {},
      },
    });

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });
});
