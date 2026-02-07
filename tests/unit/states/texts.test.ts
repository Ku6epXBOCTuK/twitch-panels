import { textsState } from "$states/texts.svelte";
import { describe, expect, it } from "vitest";

describe("texts.svelte", () => {
  describe("initial state", () => {
    it("should have default texts", () => {
      expect(textsState.texts).toBeDefined();
      expect(Array.isArray(textsState.texts)).toBe(true);
      expect(textsState.texts.length).toBeGreaterThan(0);
    });

    it("should have correct default texts", () => {
      const defaultTexts = ["About me", "Links", "Projects"];
      expect(textsState.texts).toHaveLength(defaultTexts.length);

      textsState.texts.forEach((textItem, index) => {
        expect(textItem.text).toBe(defaultTexts[index]);
        expect(textItem.id).toBe(index);
      });
    });

    it("should have unique IDs for all texts", () => {
      const ids = textsState.texts.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe("addText", () => {
    it("should add new text", () => {
      const initialLength = textsState.texts.length;
      const newText = "Test text";

      textsState.addText(newText);

      expect(textsState.texts).toHaveLength(initialLength + 1);
      expect(textsState.texts[initialLength].text).toBe(newText);
    });

    it("should assign unique ID to new text", () => {
      const initialIds = textsState.texts.map((item) => item.id);
      const maxId = Math.max(...initialIds);

      textsState.addText("New text");
      const newText = textsState.texts[textsState.texts.length - 1];

      expect(newText.id).toBe(maxId + 1);
      expect(initialIds).not.toContain(newText.id);
    });

    it("should increment ID counter", () => {
      const initialLength = textsState.texts.length;
      const firstNewId = textsState.texts[initialLength - 1].id;

      textsState.addText("First");
      textsState.addText("Second");

      const firstNew = textsState.texts[initialLength];
      const secondNew = textsState.texts[initialLength + 1];

      expect(firstNew.id).toBe(firstNewId + 1);
      expect(secondNew.id).toBe(firstNewId + 2);
    });

    it("should preserve existing texts when adding new", () => {
      const initialTexts = [...textsState.texts];
      const newText = "New text";

      textsState.addText(newText);

      initialTexts.forEach((initialText, index) => {
        expect(textsState.texts[index]).toStrictEqual(initialText);
      });
    });

    it("should add text with empty string", () => {
      const initialLength = textsState.texts.length;

      textsState.addText("");

      expect(textsState.texts).toHaveLength(initialLength + 1);
      expect(textsState.texts[initialLength].text).toBe("");
    });

    it("should add text with special characters", () => {
      const specialText = "Test @#$%^&*()_+-={}[]|\\:\";'<>?,./`~";

      textsState.addText(specialText);
      const addedText = textsState.texts[textsState.texts.length - 1];

      expect(addedText.text).toBe(specialText);
    });
  });

  describe("removeText", () => {
    it("should remove text by ID", () => {
      const initialLength = textsState.texts.length;
      const idToRemove = textsState.texts[0].id;

      textsState.removeText(idToRemove);

      expect(textsState.texts).toHaveLength(initialLength - 1);
      expect(textsState.texts.find((item) => item.id === idToRemove)).toBeUndefined();
    });

    it("should not remove text with non-existent ID", () => {
      const initialLength = textsState.texts.length;
      const initialTexts = [...textsState.texts];
      const nonExistentId = 999999;

      textsState.removeText(nonExistentId);

      expect(textsState.texts).toHaveLength(initialLength);
      expect(textsState.texts).toStrictEqual(initialTexts);
    });

    it("should preserve other texts when removing one", () => {
      const idToRemove = textsState.texts[1].id;
      const otherTexts = textsState.texts.filter((item) => item.id !== idToRemove);

      textsState.removeText(idToRemove);

      expect(textsState.texts).toStrictEqual(otherTexts);
    });

    it("should handle removing last text", () => {
      const lastId = textsState.texts[textsState.texts.length - 1].id;
      const initialLength = textsState.texts.length;

      textsState.removeText(lastId);

      expect(textsState.texts).toHaveLength(initialLength - 1);
      expect(textsState.texts.find((item) => item.id === lastId)).toBeUndefined();
    });

    it("should handle removing first text", () => {
      const firstId = textsState.texts[0].id;
      const initialLength = textsState.texts.length;

      textsState.removeText(firstId);

      expect(textsState.texts).toHaveLength(initialLength - 1);
      expect(textsState.texts.find((item) => item.id === firstId)).toBeUndefined();
    });
  });

  describe("texts getter", () => {
    it("should return array of TextItem", () => {
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

      // Add multiple texts
      for (let i = 0; i < 5; i++) {
        textsState.addText(`Text ${i}`);
        addedIds.push(textsState.texts[textsState.texts.length - 1].id);
      }

      expect(textsState.texts).toHaveLength(initialLength + 5);

      // Remove some of them
      textsState.removeText(addedIds[0]);
      textsState.removeText(addedIds[2]);
      textsState.removeText(addedIds[4]);

      expect(textsState.texts).toHaveLength(initialLength + 2);
    });
  });
});
