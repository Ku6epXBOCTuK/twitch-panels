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
  /**
   * Экспортирует панель в изображение и сохраняет её
   */
  async exportPanel(panel: Panel, konvaStage: Stage, filename?: string): Promise<ExportResult> {
    try {
      if (!konvaStage) {
        throw new ImageError("Konva Stage не передан для экспорта");
      }

      // Используем toBlob метод Konva Stage напрямую
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

  /**
   * Экспортирует Konva Stage в Blob используя встроенный метод toBlob
   */
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
   * (будет реализовано позже для batch download)
   */
  async exportPanels(panels: Panel[]): Promise<ExportResult> {
    // TODO: Реализовать пакетный экспорт с использованием JSZip
    return {
      success: false,
      error: "Пакетный экспорт еще не реализован",
    };
  }

  /**
   * Обработчик для скачивания одной панели
   * Этот метод должен быть вызван из компонента PanelPreview с передачей konvaStage
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

  /**
   * Получить сообщение об ошибке
   */
  getErrorMessage(): string | null {
    return null; // Реализовать при необходимости
  }

  /**
   * Установить сообщение об ошибке
   */
  setErrorMessage(message: string): void {
    // Реализовать при необходимости
    console.error("ExportService error:", message);
  }
}

export const exportService = new ExportService();
