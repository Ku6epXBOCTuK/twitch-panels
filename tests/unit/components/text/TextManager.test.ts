import TextManager from "$components/text/TextManager.svelte";
import { textsState } from "$states/texts.svelte";
import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";

describe("TextManager.svelte", () => {
  beforeEach(() => {
    textsState.texts.length = 0;
  });

  it("should render with card title", () => {
    render(TextManager);
    expect(screen.getByText("Тексты панелей")).toBeInTheDocument();
  });

  it("should render input group", () => {
    render(TextManager);
    const inputGroup = document.querySelector(".input-group");
    expect(inputGroup).toBeInTheDocument();
  });

  it("should show empty state when no texts", () => {
    render(TextManager);
    const textsList = document.querySelector(".texts-list");
    expect(textsList).toBeInTheDocument();
    expect(textsList?.children.length).toBe(0);
  });

  it("should render texts-list container", () => {
    render(TextManager);
    const textsList = document.querySelector(".texts-list");
    expect(textsList).toBeInTheDocument();
  });

  it("should have correct structure with Card", () => {
    render(TextManager);
    const card = document.querySelector("section.card, div[class*='card']");
    expect(card).toBeInTheDocument();
  });
});
