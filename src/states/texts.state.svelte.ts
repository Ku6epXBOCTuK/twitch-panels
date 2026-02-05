export interface TextsState {
  texts: string[];
  addText(text: string): void;
  removeText(text: string): void;
}

const defaultTexts: string[] = ["About me", "Links", "Projects"];

function createTextsState(): TextsState {
  let texts: string[] = $state(defaultTexts);

  return {
    get texts() {
      return texts;
    },
    addText(text: string) {
      texts = [...texts, text];
    },
    removeText(text: string) {
      texts = texts.filter((t) => t !== text);
    },
  };
}

export const textsState = createTextsState();
