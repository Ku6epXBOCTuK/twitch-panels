import type { Panel } from "../lib/types/panel";
import { createPanelFromText, updatePanelText } from "../stores/panelStore";

export class PanelService {
  private static instance: PanelService;

  private constructor() {}

  static getInstance(): PanelService {
    if (!PanelService.instance) {
      PanelService.instance = new PanelService();
    }
    return PanelService.instance;
  }

  validateText(text: string): boolean {
    return text.trim().length > 0;
  }

  isDuplicateText(texts: Array<{ id: string; text: string }>, text: string, excludeId?: string): boolean {
    return texts.some(t => t.id !== excludeId && t.text === text);
  }

  addText(texts: Array<{ id: string; text: string }>, text: string): Array<{ id: string; text: string }> {
    if (!this.validateText(text)) return texts;
    if (this.isDuplicateText(texts, text)) return texts;

    return [...texts, { id: crypto.randomUUID(), text }];
  }

  updateText(texts: Array<{ id: string; text: string }>, id: string, newText: string): Array<{ id: string; text: string }> {
    if (!this.validateText(newText)) return texts;
    if (this.isDuplicateText(texts, newText, id)) return texts;

    return texts.map(t => t.id === id ? { ...t, text: newText } : t);
  }

  deleteText(texts: Array<{ id: string; text: string }>, id: string): Array<{ id: string; text: string }> {
    return texts.filter(t => t.id !== id);
  }

  updatePanelsFromTexts(texts: Array<{ id: string; text: string }>, panels: Panel[], backgroundImage: string): Panel[] {
    return texts.map(textItem => {
      const existingPanel = panels.find(p => p.texts[0]?.text === textItem.text);
      if (existingPanel) {
        return updatePanelText(existingPanel, textItem.text);
      }
      return createPanelFromText(backgroundImage, textItem.text);
    });
  }

  updatePanelsBackground(panels: Panel[], newBackground: string): Panel[] {
    return panels.map(panel => ({
      ...panel,
      backgroundImage: newBackground,
      updatedAt: new Date(),
    }));
  }
}

export const panelService = PanelService.getInstance();
