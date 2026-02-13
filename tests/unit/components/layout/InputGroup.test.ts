import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import InputGroupTest from "./InputGroupTest.svelte";

describe("InputGroup.svelte", () => {
  it("should render without crashing", () => {
    render(InputGroupTest);
    expect(screen.getByTestId("input1")).toBeInTheDocument();
    expect(screen.getByTestId("input2")).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();
  });
});
