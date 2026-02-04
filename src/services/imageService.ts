import { setCurrentStep } from "../stores/uiStore";

export class ImageService {
  private static instance: ImageService;

  private constructor() {}

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  async loadDefaultBackground(): Promise<string> {
    const defaultBackground = "/backgrounds/b1.jpg";
    const response = await fetch(defaultBackground);
    if (!response.ok) throw new Error("Не удалось загрузить фоновое изображение");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // TODO: look for a better handle non string
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  handleImageUpload(image: string): void {
    setCurrentStep("crop");
  }

  handleUploadNewImage(): void {
    setCurrentStep("upload");
  }

  handleCropComplete(croppedImage: string): void {
    setCurrentStep("text");
  }

  handleCropCancel(): void {
    setCurrentStep("text");
  }

  async handleFileUpload(file: File): Promise<any> {
    // Convert file to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          success: true,
          image: reader.result as string,
        });
      reader.onerror = () =>
        reject({
          success: false,
          error: "Ошибка чтения файла",
        });
      reader.readAsDataURL(file);
    });
  }

  async handlePasteUpload(pasteEvent: ClipboardEvent): Promise<any> {
    const items = pasteEvent.clipboardData?.items;
    if (!items || items.length === 0) {
      return {
        success: false,
        error: "В буфере обмена не найдено изображений",
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
        error: "В буфере обмена не найдено изображений",
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

    return this.handleFileUpload(file);
  }

  async handleUrlUpload(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return {
          success: false,
          error: "Не удалось загрузить изображение по URL",
        };
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            success: true,
            image: reader.result as string,
          });
        reader.onerror = () =>
          reject({
            success: false,
            error: "Ошибка чтения изображения",
          });
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return {
        success: false,
        error: "Ошибка загрузки изображения по URL",
      };
    }
  }
}

export const imageService = ImageService.getInstance();
