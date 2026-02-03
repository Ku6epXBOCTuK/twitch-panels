export interface TextItem {
  id: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  x: number;
  y: number;
}

export interface Panel {
  id: string;
  backgroundImage: string;
  texts: TextItem[];
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageUploadResult {
  success: boolean;
  image?: string;
  error?: string;
}

export interface CropOptions {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

export interface ImageCropResult {
  success: boolean;
  croppedImage?: string;
  error?: string;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  currentStep: "upload" | "crop" | "text" | "preview";
  showCropModal: boolean;
  showTextManager: boolean;
}
