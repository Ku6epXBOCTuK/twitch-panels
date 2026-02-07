import { AppError, ImageError, TextError, CanvasError, StorageError } from "$lib/error.types";
import { describe, expect, it } from "vitest";

describe("error.types", () => {
  describe("AppError", () => {
    it("should create AppError with message and code", () => {
      const error = new AppError("Test error message", "TEST_CODE");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.name).toBe("AppError");
      expect(error.message).toBe("Test error message");
      expect(error.code).toBe("TEST_CODE");
      expect(error.details).toBeUndefined();
    });

    it("should create AppError with message, code and details", () => {
      const details = { userId: 123, action: "test" };
      const error = new AppError("Test error message", "TEST_CODE", details);

      expect(error.details).toEqual(details);
      expect(error.message).toBe("Test error message");
      expect(error.code).toBe("TEST_CODE");
    });

    it("should have stack trace", () => {
      const error = new AppError("Test error", "TEST_CODE");

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
    });

    it("should be throwable and catchable", () => {
      expect(() => {
        throw new AppError("Test error", "TEST_CODE");
      }).toThrow(AppError);
    });

    it("should be catchable as Error", () => {
      expect(() => {
        throw new AppError("Test error", "TEST_CODE");
      }).toThrow(Error);
    });
  });

  describe("ImageError", () => {
    it("should create ImageError with message", () => {
      const error = new ImageError("Image loading failed");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ImageError);
      expect(error.name).toBe("AppError");
      expect(error.message).toBe("Image loading failed");
      expect(error.code).toBe("IMAGE_ERROR");
    });

    it("should have correct error code", () => {
      const error = new ImageError("Test");

      expect(error.code).toBe("IMAGE_ERROR");
    });

    it("should be identifiable as ImageError", () => {
      const error = new ImageError("Test");

      expect(error instanceof ImageError).toBe(true);
    });
  });

  describe("TextError", () => {
    it("should create TextError with message", () => {
      const error = new TextError("Text validation failed");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(TextError);
      expect(error.name).toBe("AppError");
      expect(error.message).toBe("Text validation failed");
      expect(error.code).toBe("TEXT_ERROR");
    });

    it("should have correct error code", () => {
      const error = new TextError("Test");

      expect(error.code).toBe("TEXT_ERROR");
    });

    it("should be identifiable as TextError", () => {
      const error = new TextError("Test");

      expect(error instanceof TextError).toBe(true);
    });
  });

  describe("CanvasError", () => {
    it("should create CanvasError with message", () => {
      const error = new CanvasError("Canvas rendering failed");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(CanvasError);
      expect(error.name).toBe("AppError");
      expect(error.message).toBe("Canvas rendering failed");
      expect(error.code).toBe("CANVAS_ERROR");
    });

    it("should have correct error code", () => {
      const error = new CanvasError("Test");

      expect(error.code).toBe("CANVAS_ERROR");
    });

    it("should be identifiable as CanvasError", () => {
      const error = new CanvasError("Test");

      expect(error instanceof CanvasError).toBe(true);
    });
  });

  describe("StorageError", () => {
    it("should create StorageError with message", () => {
      const error = new StorageError("Storage operation failed");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(StorageError);
      expect(error.name).toBe("AppError");
      expect(error.message).toBe("Storage operation failed");
      expect(error.code).toBe("STORAGE_ERROR");
    });

    it("should have correct error code", () => {
      const error = new StorageError("Test");

      expect(error.code).toBe("STORAGE_ERROR");
    });

    it("should be identifiable as StorageError", () => {
      const error = new StorageError("Test");

      expect(error instanceof StorageError).toBe(true);
    });
  });

  describe("ErrorType union", () => {
    it("should accept all error types", () => {
      const errors: Array<AppError | ImageError | TextError | CanvasError | StorageError> = [
        new AppError("Test", "TEST"),
        new ImageError("Test"),
        new TextError("Test"),
        new CanvasError("Test"),
        new StorageError("Test"),
      ];

      errors.forEach(error => {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toBeInstanceOf(Error);
      });
    });

    it("should allow type narrowing with instanceof", () => {
      const errors: Array<AppError | ImageError | TextError | CanvasError | StorageError> = [
        new ImageError("Test"),
        new TextError("Test"),
      ];

      const imageErrors = errors.filter(e => e instanceof ImageError);
      const textErrors = errors.filter(e => e instanceof TextError);

      expect(imageErrors).toHaveLength(1);
      expect(textErrors).toHaveLength(1);
    });
  });

  describe("Error handling patterns", () => {
    it("should handle errors in try-catch blocks", () => {
      let caughtError: AppError | null = null;

      try {
        throw new ImageError("Image failed to load");
      } catch (error) {
        if (error instanceof AppError) {
          caughtError = error;
        }
      }

      expect(caughtError).not.toBeNull();
      expect(caughtError?.code).toBe("IMAGE_ERROR");
    });

    it("should preserve error details through error handling", () => {
      const originalError = new AppError("Test", "TEST", { id: 123 });
      let caughtError: AppError | null = null;

      try {
        throw originalError;
      } catch (error) {
        if (error instanceof AppError) {
          caughtError = error;
        }
      }

      expect(caughtError?.details).toEqual({ id: 123 });
    });
  });
});
