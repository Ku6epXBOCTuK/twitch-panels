export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    if (details) this.details = details;
  }
}

export class ImageError extends AppError {
  constructor(message: string) {
    super(message, "IMAGE_ERROR");
  }
}

export class TextError extends AppError {
  constructor(message: string) {
    super(message, "TEXT_ERROR");
  }
}

export class CanvasError extends AppError {
  constructor(message: string) {
    super(message, "CANVAS_ERROR");
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super(message, "STORAGE_ERROR");
  }
}

export type ErrorType = AppError | ImageError | TextError | CanvasError | StorageError;
