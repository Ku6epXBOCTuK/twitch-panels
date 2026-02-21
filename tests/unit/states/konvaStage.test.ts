import { konvaStageState } from "$states/konvaStage.svelte";
import type { Stage } from "svelte-konva";
import { describe, expect, it } from "vitest";

describe("konvaStageState integration", () => {
  it("should work", () => {
    expect(konvaStageState.stage).toBeUndefined();

    const mock = { name: "stage" } as unknown as Stage;
    konvaStageState.stage = mock;

    expect(konvaStageState.stage).toStrictEqual(mock);
  });
});
