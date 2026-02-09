import { STATE_DATA } from "$states/persisted.svelte";
import { createState } from "$states/texts.svelte";
import { describe, expect, it } from "vitest";

describe("texts.svelte", () => {
  describe("addText", () => {
    it("should add new text with unique ID", () => {
      const state = createState();
      const initialLength = state.texts.length;

      state.addText("Test text");

      expect(state.texts).toHaveLength(initialLength + 1);
      expect(state.texts[initialLength].text).toBe("Test text");
      expect(state.texts[initialLength].id).toBeDefined();
    });

    it("should not add empty text", () => {
      const state = createState();
      const initialLength = state.texts.length;

      state.addText("");
      state.addText("   ");

      expect(state.texts).toHaveLength(initialLength);
    });
  });

  describe("removeText", () => {
    it("should remove text by ID", () => {
      const state = createState();
      const idToRemove = state.texts[0].id;
      const initialLength = state.texts.length;

      state.removeText(idToRemove);

      expect(state.texts).toHaveLength(initialLength - 1);
      expect(state.texts.find((item) => item.id === idToRemove)).toBeUndefined();
    });

    it("should not affect other texts when removing", () => {
      const state = createState();
      const remainingTexts = state.texts.filter((item) => item.id !== state.texts[0].id);
      const idToRemove = state.texts[0].id;

      state.removeText(idToRemove);

      expect(state.texts).toStrictEqual(remainingTexts);
    });
  });

  describe("clear", () => {
    it("should remove all texts", () => {
      const state = createState();
      state.addText("Test 1");
      state.addText("Test 2");
      state.addText("Test 3");

      state.clear();

      expect(state.texts).toHaveLength(0);
    });
  });

  describe("STATE_DATA", () => {
    it("should serialize and deserialize texts", () => {
      const state = createState();
      state.clear();
      state.addText("First");
      state.addText("Second");
      state.addText("Third");

      const data = state[STATE_DATA];
      expect(data).toEqual(["First", "Second", "Third"]);

      // Restore from serialized data
      state[STATE_DATA] = ["New 1", "New 2"];

      expect(state.texts).toHaveLength(2);
      expect(state.texts[0].text).toBe("New 1");
      expect(state.texts[1].text).toBe("New 2");
      expect(state.texts[0].id).toBe(0);
      expect(state.texts[1].id).toBe(1);
    });

    it("should handle empty array", () => {
      const state = createState();
      state.addText("Test");

      state[STATE_DATA] = [];

      expect(state.texts).toHaveLength(0);
    });
  });
});
