import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import Button from "$components/ui/Button.svelte";
import MockIcon from "./__mocks__/MockIcon.svelte";

describe("Button.svelte", () => {

  it("should render with icon and label", () => {
    const { container } = render(Button, {
      props: {
        icon: MockIcon,
        label: "Test Button",
      },
    });

    expect(screen.getByText("Test Button")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should render with icon only", () => {
    const { container } = render(Button, {
      props: {
        icon: MockIcon,
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
      },
    });

    const button = container.querySelector("button");
    await fireEvent.click(button);

    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    const { container } = render(Button, {
      props: {
        icon: MockIcon,
        label: "Disabled",
        disabled: true,
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
      },
    });

    const button = container.querySelector("button");
    expect(button).not.toBeDisabled();
  });

  it("should render with different types", () => {
    const types = ["primary", "secondary", "danger", "outline", "mini"] as const;

    types.forEach(type => {
      const { container, unmount } = render(Button, {
        props: {
          icon: MockIcon,
          label: `${type} Button`,
          type,
        },
      });

      expect(screen.getByText(`${type} Button`)).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
      unmount();
    });
  });
});
