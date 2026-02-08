import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import CardTest from "./CardTest.svelte";

describe("Card.svelte", () => {
  it("should render without crashing", () => {
    render(CardTest);
    const card = document.querySelector(".card");
    expect(card).toBeInTheDocument();
  });
});
