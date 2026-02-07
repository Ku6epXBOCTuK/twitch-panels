import InputGroupTest from "$components/layout/InputGroupTest.svelte";
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("InputGroup.svelte", () => {
  it("should render multiple children using a wrapper component", () => {
    render(InputGroupTest);

    const inputGroup = document.querySelector(".input-group");
    expect(inputGroup).toBeInTheDocument();

    expect(screen.getByTestId("input1")).toBeInTheDocument();
    expect(screen.getByTestId("input2")).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();

    const inputs = inputGroup!.querySelectorAll("input");
    expect(inputs.length).toBe(2);
  });
});
