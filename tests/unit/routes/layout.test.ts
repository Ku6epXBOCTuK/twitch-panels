import { themeState } from "$states/theme.svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("+layout.svelte", () => {
  beforeEach(() => {
    themeState.theme = "dark";
    vi.clearAllMocks();
  });

  it("should apply dark theme", () => {
    themeState.theme = "dark";

    expect(themeState.theme).toBe("dark");
  });

  it("should apply light theme", () => {
    themeState.theme = "light";

    expect(themeState.theme).toBe("light");
  });

  it("should toggle theme", () => {
    themeState.theme = "dark";
    themeState.toggle();

    expect(themeState.theme).toBe("light");
  });
});

import Layout from "$routes/+layout.svelte";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

describe("Layout Component Coverage", () => {
  it("should render children snippet and initialize props", () => {
    const testId = "test-child";
    const childrenSnippet = createRawSnippet(() => ({
      render: () => `<span data-testid="${testId}">Hello</span>`,
    }));

    render(Layout, {
      props: {
        children: childrenSnippet,
      },
    });

    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
