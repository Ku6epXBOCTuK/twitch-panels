import Alignment from "$components/ui/Alignment.svelte";
import { render } from "@testing-library/svelte";
import { describe, it } from "vitest";

describe("Alignment.svelte", () => {
  it("should render without crashing", () => {
    render(Alignment, {
      props: {
        align: "left",
      },
    });
  });
});
