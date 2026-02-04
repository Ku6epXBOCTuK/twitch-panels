export type TextAlign = "left" | "center" | "right";

export interface TextItem {
  id: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  textAlign: TextAlign;
  paddingX: number;
  verticalOffset: number;
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
  error: string | undefined;
  currentStep: "upload" | "crop" | "text" | "preview";
  showCropModal: boolean;
  showTextManager: boolean;
}
