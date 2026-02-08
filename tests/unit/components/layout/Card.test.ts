import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import { createRawSnippet } from "svelte";
import Card from "$components/layout/Card.svelte";

describe("Card.svelte", () => {
  it("should render without crashing", () => {
    const childrenSnippet = createRawSnippet(() => ({
      render: () => "<div>Test content</div>",
    }));

    render(Card, {
      props: {
        title: "Test Title",
        children: childrenSnippet,
      },
    });
  });
});
