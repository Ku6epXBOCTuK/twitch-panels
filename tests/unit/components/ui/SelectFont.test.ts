import SelectFont from "$components/ui/SelectFont.svelte";
import { render } from "@testing-library/svelte";
import { describe, it } from "vitest";

describe("SelectFont.svelte", () => {
  it("should render without crashing", () => {
    render(SelectFont, {
      props: {
        value: "Arial",
      },
    });
  });
});
