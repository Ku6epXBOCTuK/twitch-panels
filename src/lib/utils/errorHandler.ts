import { ERROR_HANDLING } from "../constants";
import { AppError } from "../types/errors";

export function handleError(error: unknown, defaultMessage: string = "Произошла ошибка"): string {
  if (error instanceof AppError) {
    return error.recoverable ? `Ошибка: ${error.message}. Попробуйте снова.` : `Критическая ошибка: ${error.message}`;
  }

  if (error instanceof Error) {
    return `${defaultMessage}: ${error.message}`;
  }

  if (typeof error === "string") {
    return `${defaultMessage}: ${error}`;
  }

  return `${defaultMessage}: Произошла неизвестная ошибка`;
}

export function isRecoverableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.recoverable;
  }
  return false;
}

export function createError(message: string, code: string, recoverable: boolean = true, details?: unknown): AppError {
  return new AppError(message, code, recoverable, details);
}

export function logError(error: unknown, context?: string): void {
  console.error("Error occurred:", {
    error,
    context,
    timestamp: new Date().toISOString(),
    stack: error instanceof Error ? error.stack : undefined,
  });
}

export function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = ERROR_HANDLING.MAX_RETRIES,
  delayMs: number = ERROR_HANDLING.RETRY_DELAY_MS,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    const attemptOperation = () => {
      attempt++;
      operation()
        .then(resolve)
        .catch((error) => {
          if (attempt >= maxRetries) {
            reject(error);
          } else {
            setTimeout(attemptOperation, delayMs * attempt);
          }
        });
    };

    attemptOperation();
  });
}
