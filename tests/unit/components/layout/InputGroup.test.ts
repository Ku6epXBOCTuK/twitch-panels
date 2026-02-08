import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import InputGroupTest from "./InputGroupTest.svelte";

describe("InputGroup.svelte", () => {
  it("should render without crashing", () => {
    render(InputGroupTest);
    const inputGroup = document.querySelector(".input-group");
    expect(inputGroup).toBeInTheDocument();
  });
});
