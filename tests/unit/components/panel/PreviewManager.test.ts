import PreviewManager from "$components/panel/PreviewManager.svelte";
import { textsState } from "$states/texts.svelte";
import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";

describe("PreviewManager.svelte", () => {
  beforeEach(() => {
    textsState.texts.length = 0;
  });

  it("should render without crashing", () => {
    render(PreviewManager);
  });
});
