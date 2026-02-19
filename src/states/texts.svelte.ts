import { withPersistence, type Persistable } from "./persisted.svelte";

export interface TextItem {
  text: string;
  id: number;
}

export type TextState = Array<TextItem>;
export type TextStateDTO = Array<string>;

const defaultTexts: TextStateDTO = ["About me", "Links", "Projects"];

export class TextsState implements Persistable<TextStateDTO> {
  #texts: Array<TextItem> = $state(this.fromDTO(defaultTexts));
  #nextId = $state(defaultTexts.length);

  get texts() {
    return this.#texts;
  }

  addText(text: string) {
    if (text.trim().length === 0) return;
    this.#texts.push({ text, id: this.#nextId });
    this.#nextId++;
  }

  removeText(id: number) {
    this.#texts = this.#texts.filter((textItem) => textItem.id !== id);
  }

  clear() {
    this.#texts = [];
    this.#nextId = 0;
  }

  toSnapshot(): TextStateDTO {
    return this.#texts.map(({ text }) => text);
  }

  fromSnapshot(data: TextStateDTO) {
    this.#texts = this.fromDTO(data);
    this.#nextId = data.length;
  }

  fromDTO(data: TextStateDTO): TextState {
    return data.map((text, idx) => ({ text, id: idx }));
  }
}

export const textsState = withPersistence("texts", new TextsState());
