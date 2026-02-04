import { writable, type Writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { PANEL_SETTINGS, TYPOGRAPHY } from "../lib/constants";
import { type Panel, type TextItem } from "../lib/types/panel";

export const panelStore: Writable<Panel | undefined> = writable(undefined);

export const textSettingsStore = writable<Partial<TextItem>>({
  fontSize: TYPOGRAPHY.FONT_SIZE_DEFAULT,
  fontFamily: TYPOGRAPHY.FONT_FAMILY_DEFAULT,
  color: TYPOGRAPHY.TEXT_COLOR_DEFAULT,
  textAlign: TYPOGRAPHY.TEXT_ALIGN_LEFT,
  paddingX: TYPOGRAPHY.PADDING_X_DEFAULT,
  verticalOffset: 0,
});

export const updateAllTextSettings = (settings: Partial<TextItem>) => {
  textSettingsStore.update((current) => ({ ...current, ...settings }));
};

export const createEmptyPanel = (height: number = PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT): Panel => {
  const defaultText: TextItem = {
    id: uuidv4(),
    text: "",
    fontSize: TYPOGRAPHY.FONT_SIZE_DEFAULT,
    fontFamily: TYPOGRAPHY.FONT_FAMILY_DEFAULT,
    color: TYPOGRAPHY.TEXT_COLOR_DEFAULT,
    textAlign: TYPOGRAPHY.TEXT_ALIGN_CENTER,
    paddingX: TYPOGRAPHY.PADDING_X_DEFAULT,
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

export const createPanelFromText = (
  backgroundImage: string,
  text: string,
  height: number = PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT,
  textSettings?: Partial<TextItem>,
): Panel => {
  const newText: TextItem = {
    id: uuidv4(),
    text,
    fontSize: textSettings?.fontSize ?? TYPOGRAPHY.FONT_SIZE_DEFAULT,
    fontFamily: textSettings?.fontFamily ?? TYPOGRAPHY.FONT_FAMILY_DEFAULT,
    color: textSettings?.color ?? TYPOGRAPHY.TEXT_COLOR_DEFAULT,
    textAlign: textSettings?.textAlign ?? TYPOGRAPHY.TEXT_ALIGN_CENTER,
    paddingX: textSettings?.paddingX ?? TYPOGRAPHY.PADDING_X_DEFAULT,
    verticalOffset: textSettings?.verticalOffset ?? 0,
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
