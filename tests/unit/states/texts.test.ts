import { textsState } from "$states/texts.svelte";
import { describe, expect, it } from "vitest";

describe("texts.svelte", () => {
  describe("initial state", () => {
    it("should have default texts with unique IDs", () => {
      const defaultTexts = ["About me", "Links", "Projects"];
      expect(textsState.texts).toHaveLength(defaultTexts.length);
      expect(Array.isArray(textsState.texts)).toBe(true);

      textsState.texts.forEach((textItem, index) => {
        expect(textItem.text).toBe(defaultTexts[index]);
        expect(textItem.id).toBe(index);
      });

      const ids = textsState.texts.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe("addText", () => {
    it("should add new text with unique ID and increment counter", () => {
      const initialLength = textsState.texts.length;
      const initialIds = textsState.texts.map((item) => item.id);
      const maxId = Math.max(...initialIds);
      const newText = "Test text";

      textsState.addText(newText);

      expect(textsState.texts).toHaveLength(initialLength + 1);
      expect(textsState.texts[initialLength].text).toBe(newText);
      expect(textsState.texts[initialLength].id).toBe(maxId + 1);
      expect(initialIds).not.toContain(textsState.texts[initialLength].id);
    });

    it("should preserve existing texts when adding new", () => {
      const initialTexts = [...textsState.texts];
      const newText = "New text";

      textsState.addText(newText);

      initialTexts.forEach((initialText, index) => {
        expect(textsState.texts[index]).toStrictEqual(initialText);
      });
    });

    it("should not add text with empty string", () => {
      const initialLength = textsState.texts.length;

      textsState.addText("");

      expect(textsState.texts).toHaveLength(initialLength);
    });
  });

  describe("removeText", () => {
    it("should remove text by ID and preserve other texts", () => {
      const initialLength = textsState.texts.length;
      const idToRemove = textsState.texts[1].id;
      const otherTexts = textsState.texts.filter((item) => item.id !== idToRemove);

      textsState.removeText(idToRemove);

      expect(textsState.texts).toHaveLength(initialLength - 1);
      expect(textsState.texts.find((item) => item.id === idToRemove)).toBeUndefined();
      expect(textsState.texts).toStrictEqual(otherTexts);
    });

    it("should not remove text with non-existent ID", () => {
      const initialLength = textsState.texts.length;
      const initialTexts = [...textsState.texts];
      const nonExistentId = 999999;

      textsState.removeText(nonExistentId);

      expect(textsState.texts).toHaveLength(initialLength);
      expect(textsState.texts).toStrictEqual(initialTexts);
    });
  });

  describe("texts getter", () => {
    it("should return array of TextItem with correct structure", () => {
      expect(Array.isArray(textsState.texts)).toBe(true);
      textsState.texts.forEach((item) => {
        expect(item).toHaveProperty("text");
        expect(item).toHaveProperty("id");
        expect(typeof item.text).toBe("string");
        expect(typeof item.id).toBe("number");
      });
    });

    it("should return reactive texts", () => {
      const initialLength = textsState.texts.length;

      textsState.addText("Test");

      expect(textsState.texts).toHaveLength(initialLength + 1);
    });
  });

  describe("integration", () => {
    it("should maintain ID uniqueness after multiple operations", () => {
      const initialIds = new Set(textsState.texts.map((item) => item.id));

      textsState.addText("First");
      textsState.addText("Second");
      textsState.removeText(textsState.texts[0].id);
      textsState.addText("Third");

      const finalIds = textsState.texts.map((item) => item.id);
      const uniqueIds = new Set(finalIds);

      expect(finalIds.length).toBe(uniqueIds.size);
    });

    it("should handle adding and removing multiple texts", () => {
      const initialLength = textsState.texts.length;
      const addedIds: number[] = [];

      for (let i = 0; i < 5; i++) {
        textsState.addText(`Text ${i}`);
        addedIds.push(textsState.texts[textsState.texts.length - 1].id);
      }

      expect(textsState.texts).toHaveLength(initialLength + 5);

      textsState.removeText(addedIds[0]);
      textsState.removeText(addedIds[2]);
      textsState.removeText(addedIds[4]);

      expect(textsState.texts).toHaveLength(initialLength + 2);
    });
  });
});
