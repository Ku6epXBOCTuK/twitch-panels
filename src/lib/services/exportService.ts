import pkg from "file-saver";
import { ImageError } from "../types/errors";
import type { Panel } from "../types/panel";
import { handleError, logError } from "../utils/errorHandler";
const { saveAs } = pkg;

export interface ExportResult {
  success: boolean;
  error?: string;
}

export class ExportService {
  /**
   * Экспортирует панель в изображение и сохраняет её
   */
  async exportPanel(panel: Panel, filename?: string): Promise<ExportResult> {
    try {
      if (!panel.backgroundImage) {
        throw new ImageError("Нет фонового изображения для экспорта");
      }

      // Создаем canvas для экспорта
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new ImageError("Не удалось создать контекст canvas");
      }

      // Устанавливаем размеры canvas
      canvas.width = 320;
      canvas.height = panel.height;

      // Загружаем фоновое изображение
      const bgImage = await this.loadImage(panel.backgroundImage);

      // Рисуем фон
      ctx.drawImage(bgImage, 0, 0, 320, panel.height);

      // Рисуем текст
      const textItem = panel.text;
      ctx.font = `${textItem.fontSize}px ${textItem.fontFamily}`;
      ctx.fillStyle = textItem.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calculate position based on existing system
      const x = 160; // Center of 320px panel
      const y = panel.height / 2 + textItem.verticalOffset;

      ctx.fillText(textItem.text, x, y);

      // Конвертируем в blob и сохраняем
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new ImageError("Не удалось создать изображение");
        }

        const defaultFilename = `twitch-panel-${panel.id}.png`;
        saveAs(blob, filename || defaultFilename);
      }, "image/png");

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
   * Загружает изображение из base64 строки
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => resolve(img);
      img.onerror = () => reject(new ImageError("Не удалось загрузить изображение"));
      img.src = src;
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
}

export const exportService = new ExportService();
