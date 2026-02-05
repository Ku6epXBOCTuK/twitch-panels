export interface TextItem {
  text: string;
  id: number;
}

export interface TextsState {
  texts: Array<TextItem>;
  addText(text: string): void;
  removeText(id: number): void;
}

const defaultTexts: Array<TextItem> = ["About me", "Links", "Projects"].map((text, idx) => ({ text, id: idx }));

function createTextsState(): TextsState {
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
      texts.filter((textItem) => textItem.id === id);
    },
  };
}

export const textsState = createTextsState();
