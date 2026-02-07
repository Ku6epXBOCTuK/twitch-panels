import { describe, expect, it, beforeEach } from "vitest";
import { konvaAllStagesState } from "$states/konvaAllStages.svelte";

describe("konvaAllStages.svelte", () => {
  beforeEach(() => {
    // Clear the array before each test
    konvaAllStagesState.length = 0;
  });

  describe("initial state", () => {
    it("should be empty array initially", () => {
      expect(konvaAllStagesState).toBeDefined();
      expect(Array.isArray(konvaAllStagesState)).toBe(true);
      expect(konvaAllStagesState).toHaveLength(0);
    });

    it("should be reactive array", () => {
      expect(() => {
        konvaAllStagesState.push({} as any);
      }).not.toThrow();
    });
  });

  describe("adding stages", () => {
    it("should add stage to array", () => {
      const mockStage = { id: "test1" } as any;
      konvaAllStagesState.push(mockStage);

      expect(konvaAllStagesState).toHaveLength(1);
      expect(konvaAllStagesState[0]).toStrictEqual(mockStage);
    });

    it("should add multiple stages", () => {
      const stages = [
        { id: "test1" } as any,
        { id: "test2" } as any,
        { id: "test3" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      expect(konvaAllStagesState).toHaveLength(3);
      expect(konvaAllStagesState[0]).toStrictEqual(stages[0]);
      expect(konvaAllStagesState[1]).toStrictEqual(stages[1]);
      expect(konvaAllStagesState[2]).toStrictEqual(stages[2]);
    });

    it("should preserve stage order", () => {
      const stages = [
        { id: "first" } as any,
        { id: "second" } as any,
        { id: "third" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      expect(konvaAllStagesState[0].id).toBe("first");
      expect(konvaAllStagesState[1].id).toBe("second");
      expect(konvaAllStagesState[2].id).toBe("third");
    });
  });

  describe("removing stages", () => {
    it("should remove stage from array", () => {
      const mockStage = { id: "test1" } as any;
      konvaAllStagesState.push(mockStage);

      expect(konvaAllStagesState).toHaveLength(1);

      konvaAllStagesState.splice(0, 1);

      expect(konvaAllStagesState).toHaveLength(0);
    });

    it("should remove specific stage", () => {
      const stages = [
        { id: "test1" } as any,
        { id: "test2" } as any,
        { id: "test3" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      konvaAllStagesState.splice(1, 1); // Remove second stage

      expect(konvaAllStagesState).toHaveLength(2);
      expect(konvaAllStagesState[0].id).toBe("test1");
      expect(konvaAllStagesState[1].id).toBe("test3");
    });

    it("should remove all stages", () => {
      const stages = [
        { id: "test1" } as any,
        { id: "test2" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      konvaAllStagesState.length = 0;

      expect(konvaAllStagesState).toHaveLength(0);
    });
  });

  describe("updating stages", () => {
    it("should update stage at index", () => {
      const mockStage = { id: "test1" } as any;
      const updatedStage = { id: "updated" } as any;

      konvaAllStagesState.push(mockStage);
      konvaAllStagesState[0] = updatedStage;

      expect(konvaAllStagesState[0]).toStrictEqual(updatedStage);
      expect(konvaAllStagesState[0].id).toBe("updated");
    });

    it("should preserve other stages when updating one", () => {
      const stages = [
        { id: "test1" } as any,
        { id: "test2" } as any,
        { id: "test3" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      const updatedStage = { id: "updated" } as any;
      konvaAllStagesState[1] = updatedStage;

      expect(konvaAllStagesState[0]).toStrictEqual(stages[0]);
      expect(konvaAllStagesState[1]).toStrictEqual(updatedStage);
      expect(konvaAllStagesState[2]).toStrictEqual(stages[2]);
    });
  });

  describe("stage properties", () => {
    it("should preserve stage properties", () => {
      const mockStage = {
        id: "test",
        width: 320,
        height: 100,
        attrs: { test: "value" }
      } as any;

      konvaAllStagesState.push(mockStage);

      expect(konvaAllStagesState[0].id).toBe("test");
      expect(konvaAllStagesState[0].width).toBe(320);
      expect(konvaAllStagesState[0].height).toBe(100);
      expect(konvaAllStagesState[0].attrs).toEqual({ test: "value" });
    });
  });

  describe("array methods", () => {
    it("should support forEach", () => {
      const stages = [
        { id: "test1" } as any,
        { id: "test2" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      const visited: string[] = [];
      konvaAllStagesState.forEach(stage => visited.push(stage.id));

      expect(visited).toEqual(["test1", "test2"]);
    });

    it("should support map", () => {
      const stages = [
        { id: "test1" } as any,
        { id: "test2" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      const ids = konvaAllStagesState.map(stage => stage.id);

      expect(ids).toEqual(["test1", "test2"]);
    });

    it("should support filter", () => {
      const stages = [
        { id: "test1", type: "panel" } as any,
        { id: "test2", type: "preview" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      const panels = konvaAllStagesState.filter(stage => stage.type === "panel");

      expect(panels).toHaveLength(1);
      expect(panels[0].id).toBe("test1");
    });

    it("should support find", () => {
      const stages = [
        { id: "test1" } as any,
        { id: "test2" } as any,
      ];

      stages.forEach(stage => konvaAllStagesState.push(stage));

      const found = konvaAllStagesState.find(stage => stage.id === "test2");

      expect(found).toBeDefined();
      expect(found?.id).toBe("test2");
    });

    it("should support length property", () => {
      expect(konvaAllStagesState.length).toBe(0);

      konvaAllStagesState.push({ id: "test1" } as any);
      expect(konvaAllStagesState.length).toBe(1);

      konvaAllStagesState.push({ id: "test2" } as any);
      expect(konvaAllStagesState.length).toBe(2);
    });
  });

  describe("integration", () => {
    it("should handle add-remove-add cycle", () => {
      const stage1 = { id: "test1" } as any;
      const stage2 = { id: "test2" } as any;

      // Add
      konvaAllStagesState.push(stage1);
      expect(konvaAllStagesState).toHaveLength(1);

      // Remove
      konvaAllStagesState.splice(0, 1);
      expect(konvaAllStagesState).toHaveLength(0);

      // Add again
      konvaAllStagesState.push(stage2);
      expect(konvaAllStagesState).toHaveLength(1);
      expect(konvaAllStagesState[0]).toStrictEqual(stage2);
    });

    it("should handle multiple operations", () => {
      const stages = [
        { id: "test1" } as any,
        { id: "test2" } as any,
        { id: "test3" } as any,
      ];

      // Add all
      stages.forEach(stage => konvaAllStagesState.push(stage));
      expect(konvaAllStagesState).toHaveLength(3);

      // Remove middle
      konvaAllStagesState.splice(1, 1);
      expect(konvaAllStagesState).toHaveLength(2);

      // Add new at end
      konvaAllStagesState.push({ id: "test4" } as any);
      expect(konvaAllStagesState).toHaveLength(3);

      // Update first
      konvaAllStagesState[0] = { id: "updated" } as any;
      expect(konvaAllStagesState[0].id).toBe("updated");
    });
  });
});
