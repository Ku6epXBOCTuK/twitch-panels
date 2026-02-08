import { AppError, CanvasError, ImageError, StorageError, TextError } from "$lib/error.types";
import { createError, formatError, logError } from "$lib/utils/errorUtils";
import { describe, expect, it, vi } from "vitest";

describe("errorUtils", () => {
  describe("formatError", () => {
    it("should format AppError", () => {
      const error = new AppError("Test error", "TEST_CODE");
      const result = formatError(error, "Default message");

      expect(result).toBe("Default message: Test error");
    });

    it("should format Error", () => {
      const error = new Error("Test error");
      const result = formatError(error, "Default message");

      expect(result).toBe("Default message: Test error");
    });

    it("should format string error", () => {
      const error = "String error message";
      const result = formatError(error, "Default message");

      expect(result).toBe("Default message: String error message");
    });

    it("should format unknown error", () => {
      const error = { custom: "object" };
      const result = formatError(error, "Default message");

      expect(result).toBe("Default message: Произошла неизвестная ошибка");
    });

    it("should use default message when not provided", () => {
      const error = new Error("Test error");
      const result = formatError(error);

      expect(result).toBe("Произошла ошибка: Test error");
    });

    it("should format ImageError", () => {
      const error = new ImageError("Image failed");
      const result = formatError(error, "Default message");

      expect(result).toBe("Default message: Image failed");
    });

    it("should format TextError", () => {
      const error = new TextError("Text failed");
      const result = formatError(error, "Default message");

      expect(result).toBe("Default message: Text failed");
    });

    it("should format CanvasError", () => {
      const error = new CanvasError("Canvas failed");
      const result = formatError(error, "Default message");

      expect(result).toBe("Default message: Canvas failed");
    });

    it("should format StorageError", () => {
      const error = new StorageError("Storage failed");
      const result = formatError(error, "Default message");

      expect(result).toBe("Default message: Storage failed");
    });
  });

  describe("createError", () => {
    it("should create AppError with message and code", () => {
      const error = createError("Test error", "TEST_CODE");

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_CODE");
      expect(error.details).toBeUndefined();
    });

    it("should create AppError with message, code and details", () => {
      const details = { userId: 123, action: "test" };
      const error = createError("Test error", "TEST_CODE", details);

      expect(error.details).toEqual(details);
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_CODE");
    });
  });

  describe("logError", () => {
    it("should log Error with stack", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Test error");

      logError(error, "Test context");

      expect(consoleSpy).toHaveBeenCalledWith("Error occurred:", {
        error,
        context: "Test context",
        timestamp: expect.any(String),
        stack: expect.any(String),
      });

      consoleSpy.mockRestore();
    });

    it("should log AppError with stack", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new AppError("Test error", "TEST_CODE");

      logError(error, "Test context");

      expect(consoleSpy).toHaveBeenCalledWith("Error occurred:", {
        error,
        context: "Test context",
        timestamp: expect.any(String),
        stack: expect.any(String),
      });

      consoleSpy.mockRestore();
    });

    it("should log string error without stack", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      logError("String error", "Test context");

      expect(consoleSpy).toHaveBeenCalledWith("Error occurred:", {
        error: "String error",
        context: "Test context",
        timestamp: expect.any(String),
        stack: undefined,
      });

      consoleSpy.mockRestore();
    });

    it("should log error without context", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Test error");

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith("Error occurred:", {
        error,
        context: undefined,
        timestamp: expect.any(String),
        stack: expect.any(String),
      });

      consoleSpy.mockRestore();
    });
  });
});
