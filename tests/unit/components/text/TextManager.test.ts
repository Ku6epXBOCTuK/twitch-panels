import TextManager from "$components/text/TextManager.svelte";
import { textsState } from "$states/texts.svelte";
import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";

describe("TextManager.svelte", () => {
  beforeEach(() => {
    while (textsState.texts.length > 0) {
      textsState.texts.pop();
    }
  });

  it("should render without crashing", () => {
    render(TextManager);
    const cardTitle = screen.getByText("Тексты панелей");
    expect(cardTitle).toBeInTheDocument();
  });
});
