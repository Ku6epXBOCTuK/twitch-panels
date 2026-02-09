export interface TextItem {
  text: string;
  id: number;
}

const defaultTexts: Array<TextItem> = ["About me", "Links", "Projects"].map((text, idx) => ({ text, id: idx }));

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
  };
}

export const textsState = createState();
