import Button from "$components/ui/Button.svelte";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import MockIcon from "./MockIcon.svelte";

describe("Button.svelte", () => {
  it("should render with icon and label", () => {
    render(Button, {
      props: {
        icon: MockIcon,
        label: "Test Button",
        ariaLabel: "Test button",
      },
    });

    expect(screen.getByText("Test Button")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /test button/i })).toBeInTheDocument();
  });

  it("should render with icon only", () => {
    render(Button, {
      props: {
        icon: MockIcon,
        ariaLabel: "Test button",
      },
    });

    expect(screen.getByRole("button", { name: /test button/i })).toBeInTheDocument();
  });

  it("should call onclick handler", async () => {
    const onclick = vi.fn();
    render(Button, {
      props: {
        icon: MockIcon,
        label: "Click me",
        onclick,
        ariaLabel: "Test button",
      },
    });

    const button = screen.getByRole("button", { name: /test button/i });
    await fireEvent.click(button);

    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(Button, {
      props: {
        icon: MockIcon,
        label: "Disabled",
        disabled: true,
        ariaLabel: "Test button",
      },
    });

    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeDisabled();
  });

  it("should not be disabled by default", () => {
    render(Button, {
      props: {
        icon: MockIcon,
        label: "Enabled",
        ariaLabel: "Test button",
      },
    });

    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).not.toBeDisabled();
  });
});
