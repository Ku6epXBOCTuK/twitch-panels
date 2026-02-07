import { AppError } from "$lib/error.types";
import { createError, formatError, logError } from "$lib/utils/errorUtils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("errorHandler", () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
    vi.restoreAllMocks();
  });

  describe("formatError", () => {
    it("should handle AppError", () => {
      const error = new AppError("Test error", "TEST_ERROR", true);
      const result = formatError(error);

      expect(result).toBe("Произошла ошибка: Test error");
    });

    it("should handle standard Error objects", () => {
      const error = new Error("Standard error message");
      const result = formatError(error, "Custom prefix");

      expect(result).toBe("Custom prefix: Standard error message");
    });

    it("should handle string errors", () => {
      const result = formatError("String error", "Custom prefix");

      expect(result).toBe("Custom prefix: String error");
    });

    it("should handle unknown error types", () => {
      const result = formatError({ some: "object" }, "Custom prefix");

      expect(result).toBe("Custom prefix: Произошла неизвестная ошибка");
    });

    it("should use default message when none provided", () => {
      const result = formatError({ some: "object" });

      expect(result).toBe("Произошла ошибка: Произошла неизвестная ошибка");
    });
  });

  describe("createError", () => {
    it("should create AppError with default recoverable flag", () => {
      const error = createError("Test message", "TEST_CODE");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Test message");
      expect(error.code).toBe("TEST_CODE");
    });

    it("should create AppError with details", () => {
      const details = { some: "additional info" };
      const error = createError("Test message", "TEST_CODE", details);

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
});
