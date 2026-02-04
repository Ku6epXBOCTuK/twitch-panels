import { PANEL_SETTINGS } from "../constants";
import type { Panel } from "../types/panel";
import { handleError, logError } from "./errorHandler";

const STORAGE_KEY = PANEL_SETTINGS.STORAGE_KEY;
const MAX_PANELS = PANEL_SETTINGS.MAX_PANELS_COUNT;

export interface StorageResult {
  success: boolean;
  error?: string;
}

export class PanelStorage {
  savePanel(panel: Panel): StorageResult {
    try {
      const panels = this.getAllPanels();

      const existingIndex = panels.findIndex((p) => p.id === panel.id);

      if (existingIndex >= 0) {
        panels[existingIndex] = panel;
      } else {
        panels.unshift(panel);

        if (panels.length > MAX_PANELS) {
          panels.length = MAX_PANELS;
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(panels));

      return {
        success: true,
      };
    } catch (error) {
      logError(error, "Failed to save panel");
      return {
        success: false,
        error: handleError(error, "Ошибка сохранения панели"),
      };
    }
  }

  getAllPanels(): Panel[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }

      const panels: Panel[] = JSON.parse(data);

      // Convert date strings back to Date objects and validate
      return panels
        .map((panel) => ({
          ...panel,
          createdAt: new Date(panel.createdAt),
          updatedAt: new Date(panel.updatedAt),
        }))
        .filter((panel) => this.validatePanel(panel));
    } catch (error) {
      logError(error, "Failed to load panels");
      return [];
    }
  }

  getPanelById(id: string): Panel | undefined {
    try {
      const panels = this.getAllPanels();
      return panels.find((p) => p.id === id) || undefined;
    } catch (error) {
      logError(error, "Failed to get panel by id");
      return undefined;
    }
  }

  deletePanel(id: string): StorageResult {
    try {
      const panels = this.getAllPanels();
      const filteredPanels = panels.filter((p) => p.id !== id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPanels));

      return {
        success: true,
      };
    } catch (error) {
      logError(error, "Failed to delete panel");
      return {
        success: false,
        error: handleError(error, "Ошибка удаления панели"),
      };
    }
  }

  clearAll(): StorageResult {
    try {
      localStorage.removeItem(STORAGE_KEY);

      return {
        success: true,
      };
    } catch (error) {
      logError(error, "Failed to clear panels");
      return {
        success: false,
        error: handleError(error, "Ошибка очистки хранилища"),
      };
    }
  }

  private validatePanel(panel: any): panel is Panel {
    return (
      typeof panel === "object" &&
      typeof panel.id === "string" &&
      typeof panel.backgroundImage === "string" &&
      typeof panel.text === "object" &&
      typeof panel.text?.id === "string" &&
      typeof panel.text?.text === "string" &&
      typeof panel.height === "number" &&
      panel.height > 0 &&
      panel.height <= PANEL_SETTINGS.PANEL_HEIGHT_MAX &&
      panel.createdAt instanceof Date &&
      panel.updatedAt instanceof Date
    );
  }

  getPanelCount(): number {
    return this.getAllPanels().length;
  }

  hasSpaceForNewPanel(): boolean {
    return this.getPanelCount() < MAX_PANELS;
  }
}

export const panelStorage = new PanelStorage();
