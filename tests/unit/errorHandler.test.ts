// Use global test functions with globals enabled in config

import { AppError } from "$lib/types/errors";
import { createError, handleError, isRecoverableError, logError, retryOperation } from "$lib/utils/errorHandler";

let consoleErrorSpy: any;

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockClear();
  vi.restoreAllMocks();
});

describe("errorHandler", () => {
  describe("handleError", () => {
    it("should handle AppError with recoverable flag", () => {
      const error = new AppError("Test error", "TEST_ERROR", true);
      const result = handleError(error);

      expect(result).toBe("Ошибка: Test error. Попробуйте снова.");
    });

    it("should handle AppError with non-recoverable flag", () => {
      const error = new AppError("Critical error", "CRITICAL_ERROR", false);
      const result = handleError(error);

      expect(result).toBe("Критическая ошибка: Critical error");
    });

    it("should handle standard Error objects", () => {
      const error = new Error("Standard error message");
      const result = handleError(error, "Custom prefix");

      expect(result).toBe("Custom prefix: Standard error message");
    });

    it("should handle string errors", () => {
      const result = handleError("String error", "Custom prefix");

      expect(result).toBe("Custom prefix: String error");
    });

    it("should handle unknown error types", () => {
      const result = handleError({ some: "object" }, "Custom prefix");

      expect(result).toBe("Custom prefix: Произошла неизвестная ошибка");
    });

    it("should use default message when none provided", () => {
      const result = handleError({ some: "object" });

      expect(result).toBe("Произошла ошибка: Произошла неизвестная ошибка");
    });
  });

  describe("isRecoverableError", () => {
    it("should return true for recoverable AppError", () => {
      const error = new AppError("Test error", "TEST_ERROR", true);
      const result = isRecoverableError(error);

      expect(result).toBe(true);
    });

    it("should return false for non-recoverable AppError", () => {
      const error = new AppError("Test error", "TEST_ERROR", false);
      const result = isRecoverableError(error);

      expect(result).toBe(false);
    });

    it("should return false for non-AppError objects", () => {
      const error = new Error("Standard error");
      const result = isRecoverableError(error);

      expect(result).toBe(false);
    });
  });

  describe("createError", () => {
    it("should create AppError with default recoverable flag", () => {
      const error = createError("Test message", "TEST_CODE");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Test message");
      expect(error.code).toBe("TEST_CODE");
      expect(error.recoverable).toBe(true);
    });

    it("should create AppError with custom recoverable flag", () => {
      const error = createError("Test message", "TEST_CODE", false);

      expect(error).toBeInstanceOf(AppError);
      expect(error.recoverable).toBe(false);
    });

    it("should create AppError with details", () => {
      const details = { some: "additional info" };
      const error = createError("Test message", "TEST_CODE", true, details);

      expect(error.details).toBe(details);
    });
  });

  describe("logError", () => {
    it("should log error with context", () => {
      const error = new Error("Test error");
      const context = "Test context";

      logError(error, context);

      expect(consoleErrorSpy).toHaveBeenCalledWith("Error occurred:", {
        error,
        context,
        timestamp: expect.any(String),
        stack: error.stack,
      });
    });

    it("should log error without context", () => {
      const error = new Error("Test error");

      logError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith("Error occurred:", {
        error,
        context: undefined,
        timestamp: expect.any(String),
        stack: error.stack,
      });
    });

    it("should handle non-Error objects", () => {
      const error = "String error";

      logError(error, "Test context");

      expect(consoleErrorSpy).toHaveBeenCalledWith("Error occurred:", {
        error,
        context: "Test context",
        timestamp: expect.any(String),
        stack: undefined,
      });
    });
  });

  describe("retryOperation", () => {
    it("should succeed on first attempt", async () => {
      const operation = vi.fn().mockResolvedValue("success");

      const result = await retryOperation(operation, 3);

      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it("should retry on failure and succeed", async () => {
      const operation = vi.fn().mockRejectedValueOnce(new Error("First failure")).mockResolvedValueOnce("success");

      const result = await retryOperation(operation, 3, 10);

      expect(result).toBe("success");
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it("should throw after max retries", async () => {
      const operation = vi.fn().mockRejectedValue(new Error("Persistent failure"));

      await expect(retryOperation(operation, 2, 10)).rejects.toThrow("Persistent failure");
      expect(operation).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it("should wait between retries", async () => {
      const operation = vi.fn().mockRejectedValueOnce(new Error("First failure")).mockResolvedValueOnce("success");

      const startTime = Date.now();
      await retryOperation(operation, 2, 50);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(50);
    });
  });
});
