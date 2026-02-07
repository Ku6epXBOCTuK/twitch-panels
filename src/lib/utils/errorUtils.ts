import { AppError } from "$lib/error.types";

export function formatError(error: unknown, defaultMessage: string = "Произошла ошибка"): string {
  if (error instanceof AppError || error instanceof Error) {
    return `${defaultMessage}: ${error.message}`;
  }

  if (typeof error === "string") {
    return `${defaultMessage}: ${error}`;
  }

  return `${defaultMessage}: Произошла неизвестная ошибка`;
}

export function createError(message: string, code: string, recoverable: boolean = true, details?: unknown): AppError {
  return new AppError(message, code, recoverable);
}

export function logError(error: unknown, context?: string): void {
  console.error("Error occurred:", {
    error,
    context,
    timestamp: new Date().toISOString(),
    stack: error instanceof Error ? error.stack : undefined,
  });
}
