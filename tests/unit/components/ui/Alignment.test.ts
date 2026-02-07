import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Alignment from "$components/ui/Alignment.svelte";

describe("Alignment.svelte", () => {
  it("should render with default left alignment", () => {
    const { container } = render(Alignment, {
      props: {
        align: "left",
      },
    });

    const buttons = container.querySelectorAll(".align-btn");
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveClass("active");
  });

  it("should render with center alignment", () => {
    const { container } = render(Alignment, {
      props: {
        align: "center",
      },
    });

    const buttons = container.querySelectorAll(".align-btn");
    expect(buttons[1]).toHaveClass("active");
  });

  it("should render with right alignment", () => {
    const { container } = render(Alignment, {
      props: {
        align: "right",
      },
    });

    const buttons = container.querySelectorAll(".align-btn");
    expect(buttons[2]).toHaveClass("active");
  });

  it("should change alignment on button click", async () => {
    const { container } = render(Alignment, {
      props: {
        align: "left",
      },
    });

    const buttons = container.querySelectorAll(".align-btn");

    await fireEvent.click(buttons[1]);
    expect(buttons[1]).toHaveClass("active");
    expect(buttons[0]).not.toHaveClass("active");

    await fireEvent.click(buttons[2]);
    expect(buttons[2]).toHaveClass("active");
    expect(buttons[1]).not.toHaveClass("active");
  });

  it("should render all alignment buttons", () => {
    const { container } = render(Alignment, {
      props: {
        align: "left",
      },
    });

    const buttons = container.querySelectorAll(".align-btn");
    expect(buttons).toHaveLength(3);
  });
});
