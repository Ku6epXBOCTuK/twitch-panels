import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Badge from "$components/ui/Badge.svelte";

describe("Badge.svelte", () => {
  it("should render with string text", () => {
    render(Badge, {
      props: {
        text: "Test Badge",
      },
    });

    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("should render with number text", () => {
    render(Badge, {
      props: {
        text: 42,
      },
    });

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("should render with empty string", () => {
    render(Badge, {
      props: {
        text: "",
      },
    });
  });

  it("should render with zero", () => {
    render(Badge, {
      props: {
        text: 0,
      },
    });

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
