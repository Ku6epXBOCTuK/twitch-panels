import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import CardTest from "./CardTest.svelte";

describe("Card.svelte", () => {
  it("should render without crashing", () => {
    render(CardTest);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByTestId("card-content")).toBeInTheDocument();
  });
});
