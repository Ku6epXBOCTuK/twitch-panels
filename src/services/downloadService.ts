import { ImageError } from "$lib/error.types";
import { formatError, logError } from "$lib/utils/errorUtils";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Stage } from "konva/lib/Stage";

export type DownloadResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export interface DownloadItem {
  filename: string;
  stage: Stage;
}

export class DownloadService {
  async downloadPanel(konvaStage: Stage, label: string): Promise<DownloadResult> {
    try {
      const blob = await this.stageToBlob(konvaStage);

      const filename = `${label}.png`;
      saveAs(blob, filename);

      return {
        success: true,
      };
    } catch (error) {
      logError(error, "Ошибка сохранения панели");
      return {
        success: false,
        error: formatError(error, "Ошибка сохранения панели"),
      };
    }
  }

  async downloadAll(panels: Array<DownloadItem>): Promise<DownloadResult> {
    try {
      const zip = new JSZip();
      for (const panel of panels) {
        const blob = await this.stageToBlob(panel.stage);
        zip.file(`${panel.filename}.png`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "panels.zip");

      return {
        success: true,
      };
    } catch (error) {
      logError(error, "Ошибка сохранения архива");
      return {
        success: false,
        error: formatError(error, "Ошибка сохранения архива"),
      };
    }
  }

  private async stageToBlob(konvaStage: Stage): Promise<Blob> {
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
}

export const downloadService = new DownloadService();
