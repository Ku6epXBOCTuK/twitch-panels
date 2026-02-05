export interface TextItem {
  text: string;
  id: number;
}

const defaultTexts: Array<TextItem> = ["About me", "Links", "Projects"].map((text, idx) => ({ text, id: idx }));

function createTextsState() {
  let texts: Array<TextItem> = $state(defaultTexts);
  let nextId = $state(defaultTexts.length);

  return {
    get texts() {
      return texts;
    },
    addText(text: string) {
      texts.push({ text, id: nextId });
      nextId++;
    },
    removeText(id: number) {
      texts = texts.filter((textItem) => textItem.id !== id);
    },
  };
}

export const textsState = createTextsState();
