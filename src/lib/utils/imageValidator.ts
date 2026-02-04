import { IMAGE_SETTINGS } from "../constants";
import { ImageError } from "../types/errors";

export const MAX_FILE_SIZE = IMAGE_SETTINGS.MAX_FILE_SIZE;
export const SUPPORTED_FORMATS = IMAGE_SETTINGS.SUPPORTED_FORMATS;

export type ValidationResult =
  | {
      isValid: true;
    }
  | {
      isValid: false;
      error: string;
    };

export function validateFileSize(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  return { isValid: true };
}

export function validateFileType(file: File): ValidationResult {
  if (!SUPPORTED_FORMATS.includes(file.type as any)) {
    return {
      isValid: false,
      error: `Неподдерживаемый формат. Допустимые форматы: ${SUPPORTED_FORMATS.join(", ")}`,
    };
  }
  return { isValid: true };
}

export function validateImageFile(file: File): ValidationResult {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  const typeValidation = validateFileType(file);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  return { isValid: true };
}

export function validateImageUrl(url: string): ValidationResult {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: "Неверный URL формат",
    };
  }
}

export function validateImageElement(img: HTMLImageElement): ValidationResult {
  if (!img.naturalWidth || !img.naturalHeight) {
    return {
      isValid: false,
      error: "Изображение не может быть загружено или повреждено",
    };
  }
  return { isValid: true };
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageError("Не удалось загрузить изображение"));

    img.src = src;
  });
}

export function getImageDimensions(img: HTMLImageElement): { width: number; height: number } {
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
  };
}
