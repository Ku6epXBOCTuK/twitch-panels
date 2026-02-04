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
}

export const imageService = ImageService.getInstance();
