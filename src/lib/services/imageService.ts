import { type ImageUploadResult, type ImageCropResult } from "../types/panel";
import { ImageError } from "../types/errors";
import {
  validateImageFile,
  validateImageUrl,
  loadImage,
  getImageDimensions,
  calculateAspectRatioFit,
} from "../utils/imageValidator";
import { handleError, logError } from "../utils/errorHandler";

export class ImageService {
  async handleFileUpload(file: File): Promise<ImageUploadResult> {
    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // Convert file to base64
      const base64 = await this.fileToBase64(file);

      return {
        success: true,
        image: base64,
      };
    } catch (error) {
      logError(error, "File upload failed");
      return {
        success: false,
        error: handleError(error, "Ошибка загрузки файла"),
      };
    }
  }

  async handleUrlUpload(url: string): Promise<ImageUploadResult> {
    try {
      // Validate URL
      const urlValidation = validateImageUrl(url);
      if (!urlValidation.isValid) {
        return {
          success: false,
          error: urlValidation.error,
        };
      }

      // Load image
      const img = await loadImage(url);

      // Validate loaded image
      const imgValidation = getImageDimensions(img);
      if (imgValidation.width === 0 || imgValidation.height === 0) {
        return {
          success: false,
          error: "Не удалось загрузить изображение по указанному URL",
        };
      }

      // Convert to base64
      const base64 = await this.imageToBase64(img);

      return {
        success: true,
        image: base64,
      };
    } catch (error) {
      logError(error, "URL upload failed");
      return {
        success: false,
        error: handleError(error, "Ошибка загрузки изображения по URL"),
      };
    }
  }

  async handlePasteUpload(pasteEvent: ClipboardEvent): Promise<ImageUploadResult> {
    try {
      const items = pasteEvent.clipboardData?.items;
      if (!items || items.length === 0) {
        return {
          success: false,
          error: "В буфер обмена не найдено изображений",
        };
      }

      // Find image item
      let imageItem: DataTransferItem | undefined = undefined;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          imageItem = items[i];
          break;
        }
      }

      if (!imageItem) {
        return {
          success: false,
          error: "В буфер обмена не найдено изображений",
        };
      }

      // Get file from clipboard item
      const file = imageItem.getAsFile();
      if (!file) {
        return {
          success: false,
          error: "Не удалось получить файл из буфера обмена",
        };
      }

      // Validate and process file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      const base64 = await this.fileToBase64(file);

      return {
        success: true,
        image: base64,
      };
    } catch (error) {
      logError(error, "Paste upload failed");
      return {
        success: false,
        error: handleError(error, "Ошибка вставки изображения"),
      };
    }
  }

  async cropImage(
    imageSrc: string,
    cropArea: { x: number; y: number; width: number; height: number },
  ): Promise<ImageCropResult> {
    try {
      const img = await loadImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new ImageError("Не удалось создать контекст canvas");
      }

      // Set canvas size to crop area
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      // Draw cropped image
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height,
      );

      // Convert to base64
      const croppedImage = canvas.toDataURL("image/png");

      return {
        success: true,
        croppedImage,
      };
    } catch (error) {
      logError(error, "Image cropping failed");
      return {
        success: false,
        error: handleError(error, "Ошибка обрезки изображения"),
      };
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // TODO: look for a better way to handle errors non strings
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new ImageError("Ошибка чтения файла"));
      reader.readAsDataURL(file);
    });
  }

  private imageToBase64(img: HTMLImageElement): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new ImageError("Не удалось создать контекст canvas");
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    });
  }
}
