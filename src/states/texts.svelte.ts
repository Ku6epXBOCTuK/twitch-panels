import { STATE_DATA, withPersistence } from "./persisted.svelte";

export interface TextItem {
  text: string;
  id: number;
}

const defaultTexts: Array<TextItem> = ["About me", "Links", "Projects"].map((text, idx) => ({
  text,
  id: idx,
}));

export function createState() {
  let texts: Array<TextItem> = $state(defaultTexts);
  let nextId = $state(defaultTexts.length);

  return {
    get texts() {
      return texts;
    },
    addText(text: string) {
      if (text.trim().length === 0) return;
      texts.push({ text, id: nextId });
      nextId++;
    },
    removeText(id: number) {
      texts = texts.filter((textItem) => textItem.id !== id);
    },
    clear() {
      texts = [];
      nextId = 0;
    },
    get [STATE_DATA]() {
      return texts.map(({ text }) => text);
    },
    set [STATE_DATA](newTexts: Array<string>) {
      texts = newTexts.map((text, idx) => ({ text, id: idx }));
      nextId = newTexts.length;
    },
  };
}

export const textsState = withPersistence("texts", createState());
