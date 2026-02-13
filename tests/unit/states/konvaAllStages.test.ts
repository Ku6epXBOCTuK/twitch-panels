import { konvaAllStagesState } from "$states/konvaAllStages.svelte";
import { describe, expect, it } from "vitest";

describe("konvaAllStages.svelte", () => {
  it("should import successfully", () => {
    expect(konvaAllStagesState).toBeDefined();
  });
});
