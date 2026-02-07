import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import SelectFont from "$components/ui/SelectFont.svelte";

describe("SelectFont.svelte", () => {
  const fonts = [
    "Arial",
    "Verdana",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Impact",
    "Comic Sans MS",
    "Trebuchet MS",
  ];

  it("should render with initial value", () => {
    const { container } = render(SelectFont, {
      props: {
        value: "Arial",
      },
    });

    const select = container.querySelector(".select-input");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("Arial");
  });

  it("should render all font options", () => {
    render(SelectFont, {
      props: {
        value: "Arial",
      },
    });

    fonts.forEach(font => {
      const options = screen.queryAllByText(font);
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it("should update value on change", async () => {
    const { container } = render(SelectFont, {
      props: {
        value: "Arial",
      },
    });

    const select = container.querySelector(".select-input");
    await fireEvent.change(select, { target: { value: "Verdana" } });

    expect(select).toHaveValue("Verdana");
  });

  it("should select different fonts", async () => {
    const { container } = render(SelectFont, {
      props: {
        value: "Arial",
      },
    });

    const select = container.querySelector(".select-input");

    await fireEvent.change(select, { target: { value: "Georgia" } });
    expect(select).toHaveValue("Georgia");

    await fireEvent.change(select, { target: { value: "Impact" } });
    expect(select).toHaveValue("Impact");
  });
});
