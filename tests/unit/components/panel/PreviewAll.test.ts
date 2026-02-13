import PreviewAll from "$components/panel/PreviewAll.svelte";
import { textsState } from "$states/texts.svelte";
import { render } from "@testing-library/svelte";
import { beforeEach, describe, it } from "vitest";

describe("PreviewAll.svelte", () => {
  beforeEach(() => {
    textsState.texts.length = 0;
  });

  it("should render without crashing", () => {
    render(PreviewAll);
  });
});
