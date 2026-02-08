import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Alignment from "$components/ui/Alignment.svelte";

describe("Alignment.svelte", () => {


  it("should render without crashing", () => {
    render(Alignment, {
      props: {
        align: "left",
      },
    });
  });


});
