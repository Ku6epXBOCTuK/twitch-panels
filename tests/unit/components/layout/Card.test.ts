import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import { createRawSnippet } from "svelte";
import Card from "$components/layout/Card.svelte";

describe("Card.svelte", () => {
  it("should render with string title", () => {
    const childrenSnippet = createRawSnippet(() => ({
      render: () => "<div>Test content</div>",
    }));

    const { container } = render(Card, {
      props: {
        title: "Test Title",
        children: childrenSnippet,
      },
    });

    expect(container.querySelector(".card-title")).toHaveTextContent("Test Title");
    expect(container.querySelector(".card-body")).toHaveTextContent("Test content");
  });

  it("should render with snippet title", () => {
    const titleSnippet = createRawSnippet(() => ({
      render: () => "<span>Snippet Title</span>",
    }));
    const childrenSnippet = createRawSnippet(() => ({
      render: () => "<div>Test content</div>",
    }));

    const { container } = render(Card, {
      props: {
        title: titleSnippet,
        children: childrenSnippet,
      },
    });

    expect(container.querySelector(".card-title")).toHaveTextContent("Snippet Title");
    expect(container.querySelector(".card-body")).toHaveTextContent("Test content");
  });

  it("should render with titleSnippet", () => {
    const titleSnippet = createRawSnippet(() => ({
      render: () => "<button>Action</button>",
    }));
    const childrenSnippet = createRawSnippet(() => ({
      render: () => "<div>Test content</div>",
    }));

    const { container } = render(Card, {
      props: {
        title: "Test Title",
        children: childrenSnippet,
        titleSnippet: titleSnippet,
      },
    });

    expect(container.querySelector(".card-title")).toHaveTextContent("Test Title");
    expect(container.querySelector(".card-body")).toHaveTextContent("Test content");
    expect(container.querySelector(".card-snippet")).toHaveTextContent("Action");
  });

  it("should render without titleSnippet", () => {
    const childrenSnippet = createRawSnippet(() => ({
      render: () => "<div>Test content</div>",
    }));

    const { container } = render(Card, {
      props: {
        title: "Test Title",
        children: childrenSnippet,
      },
    });

    expect(container.querySelector(".card-title")).toHaveTextContent("Test Title");
    expect(container.querySelector(".card-body")).toHaveTextContent("Test content");
  });
});
