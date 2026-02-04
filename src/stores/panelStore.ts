import { writable, type Writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { type Panel, type TextItem } from "../lib/types/panel";

export const panelStore: Writable<Panel | undefined> = writable(undefined);

// Panel creation should go through panelService.updatePanelsFromTexts()
// These functions are kept for backward compatibility but should be avoided
export const createEmptyPanel = (height: number = 100): Panel => {
  const defaultText: TextItem = {
    id: uuidv4(),
    text: "",
    fontSize: 18,
    fontFamily: "Arial",
    color: "#ffffff",
    textAlign: "center",
    paddingX: 10,
    verticalOffset: 0,
  };

  return {
    id: uuidv4(),
    backgroundImage: "",
    text: defaultText,
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

export const updatePanelText = (panel: Panel, text: string): Panel => {
  return updatePanel(panel, {
    text: { ...panel.text, text },
  });
};

export const updateTextProperties = (panel: Panel, updates: Partial<TextItem>): Panel => {
  return updatePanel(panel, {
    text: { ...panel.text, ...updates },
  });
};

export const createPanelFromText = (backgroundImage: string, text: string, height: number = 100): Panel => {
  const newText: TextItem = {
    id: uuidv4(),
    text,
    fontSize: 18,
    fontFamily: "Arial",
    color: "#ffffff",
    textAlign: "center",
    paddingX: 10,
    verticalOffset: 0,
  };

  return {
    id: uuidv4(),
    backgroundImage,
    text: newText,
    height,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
