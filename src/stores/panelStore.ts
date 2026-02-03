import { writable, type Writable } from "svelte/store";
import { type Panel } from "../lib/types/panel";
import { v4 as uuidv4 } from "uuid";

export const panelStore: Writable<Panel | null> = writable(null);

export const createEmptyPanel = (height: number = 100): Panel => {
  return {
    id: uuidv4(),
    backgroundImage: "",
    texts: [],
    height,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updatePanel = (panel: Panel, updates: Partial<Panel>): Panel => {
  return {
    ...panel,
    ...updates,
    updatedAt: new Date(),
  };
};

export const addTextToPanel = (panel: Panel, text: string): Panel => {
  const newText = {
    id: uuidv4(),
    text,
    fontSize: 18,
    fontFamily: "Arial",
    color: "#ffffff",
    textAlign: "center" as const,
    paddingX: 10,
    verticalOffset: 0,
  };

  return updatePanel(panel, {
    texts: [...panel.texts, newText],
  });
};

export const updateTextInPanel = (panel: Panel, textId: string, updates: Partial<Panel["texts"][0]>): Panel => {
  const updatedTexts = panel.texts.map((text) => (text.id === textId ? { ...text, ...updates } : text));

  return updatePanel(panel, { texts: updatedTexts });
};

export const removeTextFromPanel = (panel: Panel, textId: string): Panel => {
  const updatedTexts = panel.texts.filter((text) => text.id !== textId);
  return updatePanel(panel, { texts: updatedTexts });
};
