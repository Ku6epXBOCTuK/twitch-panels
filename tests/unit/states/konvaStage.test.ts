import { konvaStageState } from "$states/konvaStage.svelte";
import { describe, expect, it } from "vitest";

describe("konvaStage.svelte", () => {
  describe("initial state", () => {
    it("should have undefined stage initially", () => {
      expect(konvaStageState.stage).toBeUndefined();
    });

    it("should have stage getter", () => {
      expect(konvaStageState).toHaveProperty("stage");
    });

    it("should have stage setter", () => {
      expect(() => {
        konvaStageState.stage = {} as any;
      }).not.toThrow();
    });
  });

  describe("stage getter", () => {
    it("should return current stage", () => {
      const mockStage = { id: "test" } as any;
      konvaStageState.stage = mockStage;
      expect(konvaStageState.stage).toBeDefined();
      expect(konvaStageState.stage).toStrictEqual(mockStage);
    });

    it("should be undefined only at initialization", () => {
      expect(konvaStageState.stage).toBeDefined();
    });
  });

  describe("stage setter", () => {
    it("should set stage", () => {
      const mockStage = { id: "test" } as any;
      konvaStageState.stage = mockStage;

      expect(konvaStageState.stage).toStrictEqual(mockStage);
    });

    it("should allow updating stage", () => {
      const firstStage = { id: "first" } as any;
      const secondStage = { id: "second" } as any;

      konvaStageState.stage = firstStage;
      expect(konvaStageState.stage).toStrictEqual(firstStage);

      konvaStageState.stage = secondStage;
      expect(konvaStageState.stage).toStrictEqual(secondStage);
      expect(konvaStageState.stage).not.toStrictEqual(firstStage);
    });
  });

  // describe("stage lifecycle", () => {
  //   it("should handle stage creation", () => {
  //     const mockStage = { id: "new-stage" } as any;

  //     konvaStageState.stage = mockStage;

  //     expect(konvaStageState.stage).toStrictEqual(mockStage);
  //     expect(konvaStageState.stage?.id).toBe("new-stage");
  //   });

  //   it("should handle stage destruction", () => {
  //     const mockStage = { id: "to-destroy" } as any;

  //     konvaStageState.stage = mockStage;
  //     expect(konvaStageState.stage).toBeDefined();

  //     konvaStageState.stage = undefined;
  //     expect(konvaStageState.stage).toBeUndefined();
  //   });

  //   it("should handle stage replacement", () => {
  //     const oldStage = { id: "old" } as any;
  //     const newStage = { id: "new" } as any;

  //     konvaStageState.stage = oldStage;
  //     expect(konvaStageState.stage).toStrictEqual(oldStage);

  //     konvaStageState.stage = newStage;
  //     expect(konvaStageState.stage).toStrictEqual(newStage);
  //     expect(konvaStageState.stage).not.toStrictEqual(oldStage);
  //   });
  // });
});
