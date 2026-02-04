import pkg from "file-saver";
import type { Stage } from "konva/lib/Stage";
import { ImageError } from "../lib/types/errors";
import type { Panel } from "../lib/types/panel";
import { handleError, logError } from "../lib/utils/errorHandler";
const { saveAs } = pkg;

export interface ExportResult {
  success: boolean;
  error?: string;
}

export class ExportService {
  async exportPanel(panel: Panel, konvaStage: Stage, filename?: string): Promise<ExportResult> {
    try {
      if (!konvaStage) {
        throw new ImageError("Konva Stage не передан для экспорта");
      }

      const blob = await this.exportKonvaStageToBlob(konvaStage);

      if (!blob) {
        throw new ImageError("Не удалось создать изображение");
      }

      const defaultFilename = `twitch-panel-${panel.id}.png`;
      saveAs(blob, filename || defaultFilename);

      return {
        success: true,
      };
    } catch (error) {
      logError(error, "Panel export failed");
      return {
        success: false,
        error: handleError(error, "Ошибка экспорта панели"),
      };
    }
  }

  private async exportKonvaStageToBlob(konvaStage: Stage): Promise<Blob | null> {
    if (!konvaStage || typeof konvaStage.toBlob !== "function") {
      throw new ImageError("Konva Stage не найден или не поддерживает toBlob");
    }

    return new Promise((resolve, reject) => {
      konvaStage.toBlob({
        callback: (blob: Blob | null) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new ImageError("Не удалось создать изображение из Konva Stage"));
          }
        },
      });
    });
  }

  /**
   * Экспортирует несколько панелей в ZIP архив
   */
  async exportPanels(panels: Panel[]): Promise<ExportResult> {
    return {
      success: false,
      error: "Пакетный экспорт еще не реализован",
    };
  }

  /**
   * Обработчик для скачивания одной панели
   */
  async handleDownload(panel: Panel, konvaStage: Stage): Promise<void> {
    const result = await this.exportPanel(panel, konvaStage);
    if (!result.success) {
      throw new Error(result.error || "Ошибка экспорта панели");
    }
  }

  /**
   * Обработчик для скачивания всех панелей
   */
  async handleDownloadAll(panels: Panel[]): Promise<void> {
    const result = await this.exportPanels(panels);
    if (!result.success) {
      throw new Error(result.error || "Ошибка экспорта панелей");
    }
  }

  getErrorMessage(): string | null {
    return null;
  }

  setErrorMessage(message: string): void {
    console.error("ExportService error:", message);
  }
}

export const exportService = new ExportService();
