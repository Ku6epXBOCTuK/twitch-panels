import { createState } from "$states/texts.svelte";
import { describe, expect, it } from "vitest";

describe("texts.svelte", () => {
  describe("addText", () => {
    it("should add new text with unique ID and increment counter", () => {
      const state = createState();
      const initialLength = state.texts.length;
      const initialIds = state.texts.map((item) => item.id);
      const maxId = Math.max(...initialIds);
      const newText = "Test text";

      state.addText(newText);

      expect(state.texts).toHaveLength(initialLength + 1);
      expect(state.texts[initialLength].text).toBe(newText);
      expect(state.texts[initialLength].id).toBe(maxId + 1);
      expect(initialIds).not.toContain(state.texts[initialLength].id);
    });

    it("should not add text with empty string", () => {
      const state = createState();
      const initialLength = state.texts.length;

      state.addText("");

      expect(state.texts).toHaveLength(initialLength);
    });
  });

  describe("removeText", () => {
    it("should remove text by ID and preserve other texts", () => {
      const state = createState();
      const initialLength = state.texts.length;
      const idToRemove = state.texts[1].id;
      const otherTexts = state.texts.filter((item) => item.id !== idToRemove);

      state.removeText(idToRemove);

      expect(state.texts).toHaveLength(initialLength - 1);
      expect(state.texts.find((item) => item.id === idToRemove)).toBeUndefined();
      expect(state.texts).toStrictEqual(otherTexts);
    });

    it("should not remove text with non-existent ID", () => {
      const state = createState();
      const initialLength = state.texts.length;
      const initialTexts = [...state.texts];
      const nonExistentId = 999999;

      state.removeText(nonExistentId);

      expect(state.texts).toHaveLength(initialLength);
      expect(state.texts).toStrictEqual(initialTexts);
    });
  });

  describe("clear", () => {
    it("should clear all texts", () => {
      const state = createState();
      state.addText("Test 1");
      state.addText("Test 2");
      expect(state.texts.length).toBeGreaterThanOrEqual(2);

      state.clear();
      expect(state.texts).toHaveLength(0);
    });
  });

  describe("integration", () => {
    it("should maintain ID uniqueness after multiple operations", () => {
      const state = createState();
      const initialIds = new Set(state.texts.map((item) => item.id));

      state.addText("First");
      state.addText("Second");
      state.removeText(state.texts[0].id);
      state.addText("Third");

      const finalIds = state.texts.map((item) => item.id);
      const uniqueIds = new Set(finalIds);

      expect(finalIds.length).toBe(uniqueIds.size);
    });

    it("should handle adding and removing multiple texts", () => {
      const state = createState();
      const initialLength = state.texts.length;
      const addedIds: number[] = [];

      for (let i = 0; i < 5; i++) {
        state.addText(`Text ${i}`);
        addedIds.push(state.texts[state.texts.length - 1].id);
      }

      expect(state.texts).toHaveLength(initialLength + 5);

      state.removeText(addedIds[0]);
      state.removeText(addedIds[2]);
      state.removeText(addedIds[4]);

      expect(state.texts).toHaveLength(initialLength + 2);
    });
  });
});
