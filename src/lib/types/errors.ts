export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ImageError extends AppError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "IMAGE_ERROR", recoverable);
  }
}

export class TextError extends AppError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "TEXT_ERROR", recoverable);
  }
}

export class CanvasError extends AppError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "CANVAS_ERROR", recoverable);
  }
}

export class StorageError extends AppError {
  constructor(message: string, recoverable: boolean = true) {
    super(message, "STORAGE_ERROR", recoverable);
  }
}

export type ErrorType = AppError | ImageError | TextError | CanvasError | StorageError;
