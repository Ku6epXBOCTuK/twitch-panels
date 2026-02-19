import { TextsState } from "$states/texts.svelte";
import { describe, expect, it } from "vitest";

describe("texts.svelte", () => {
  describe("addText", () => {
    it("should add new text with unique ID", () => {
      const state = new TextsState();
      const initialLength = state.texts.length;

      state.addText("Test text");

      expect(state.texts).toHaveLength(initialLength + 1);
      expect(state.texts[initialLength].text).toBe("Test text");
      expect(state.texts[initialLength].id).toBeDefined();
    });

    it("should not add empty text", () => {
      const state = new TextsState();
      const initialLength = state.texts.length;

      state.addText("");
      state.addText("   ");

      expect(state.texts).toHaveLength(initialLength);
    });
  });

  describe("removeText", () => {
    it("should remove text by ID", () => {
      const state = new TextsState();
      const idToRemove = state.texts[0].id;
      const initialLength = state.texts.length;

      state.removeText(idToRemove);

      expect(state.texts).toHaveLength(initialLength - 1);
      expect(state.texts.find((item) => item.id === idToRemove)).toBeUndefined();
    });

    it("should not affect other texts when removing", () => {
      const state = new TextsState();
      const remainingTexts = state.texts.filter((item) => item.id !== state.texts[0].id);
      const idToRemove = state.texts[0].id;

      state.removeText(idToRemove);

      expect(state.texts).toStrictEqual(remainingTexts);
    });
  });

  describe("clear", () => {
    it("should remove all texts", () => {
      const state = new TextsState();
      state.addText("Test 1");
      state.addText("Test 2");
      state.addText("Test 3");

      state.clear();

      expect(state.texts).toHaveLength(0);
    });
  });

  describe("persistence", () => {
    it("should serialize and deserialize texts", () => {
      const state = new TextsState();
      state.clear();
      state.addText("First");
      state.addText("Second");
      state.addText("Third");

      const data = state.toSnapshot();
      expect(data).toEqual(["First", "Second", "Third"]);

      state.fromSnapshot(["New 1", "New 2"]);

      expect(state.texts).toHaveLength(2);
      expect(state.texts[0].text).toBe("New 1");
      expect(state.texts[1].text).toBe("New 2");
      expect(state.texts[0].id).toBe(0);
      expect(state.texts[1].id).toBe(1);
    });

    it("should handle empty array", () => {
      const state = new TextsState();
      state.addText("Test");

      state.fromSnapshot([]);

      expect(state.texts).toHaveLength(0);
    });
  });
});
