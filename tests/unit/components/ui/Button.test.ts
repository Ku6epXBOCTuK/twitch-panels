import Button from "$components/ui/Button.svelte";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import MockIcon from "./MockIcon.svelte";

describe("Button.svelte", () => {
  it("should render with icon and label", () => {
    const { container } = render(Button, {
      props: {
        icon: MockIcon,
        label: "Test Button",
        ariaLabel: "Test button",
      },
    });

    expect(screen.getByText("Test Button")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render with icon only", () => {
    const { container } = render(Button, {
      props: {
        icon: MockIcon,
        ariaLabel: "Test button",
      },
    });

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should call onclick handler", async () => {
    const onclick = vi.fn();
    const { container } = render(Button, {
      props: {
        icon: MockIcon,
        label: "Click me",
        onclick,
        ariaLabel: "Test button",
      },
    });

    const button = container.querySelector("button");
    if (!button) throw new Error("Button element not found");
    await fireEvent.click(button);

    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(Button, {
      props: {
        icon: MockIcon,
        label: "Disabled",
        disabled: true,
        ariaLabel: "Test button",
      },
    });

    const button = container.querySelector("button");
    expect(button).toBeDisabled();
  });

  it("should not be disabled by default", () => {
    const { container } = render(Button, {
      props: {
        icon: MockIcon,
        label: "Enabled",
        ariaLabel: "Test button",
      },
    });

    const button = container.querySelector("button");
    expect(button).not.toBeDisabled();
  });
});
