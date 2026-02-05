import ImageUpload from "$components/image/ImageUpload.svelte";
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the stores and services
vi.mock("$stores/uiStore", () => ({
  uiStore: {
    subscribe: vi.fn((callback) => {
      callback({ error: null, loading: false });
      return () => {};
    }),
  },
  setCurrentStep: vi.fn(),
  setLoading: vi.fn(),
  clearError: vi.fn(),
}));

vi.mock("$services/imageService", () => ({
  imageService: {
    validateAndProcessImage: vi.fn(),
  },
}));

vi.mock("$lib/utils/errorHandler", () => ({
  handleError: vi.fn((error) => `Error: ${error}`),
}));

describe("ImageUpload", () => {
  let mockOnImageSelect: (image: string) => void;
  let mockImageService: any;

  beforeEach(() => {
    mockOnImageSelect = vi.fn();
    vi.clearAllMocks();

    // Setup mock image service
    mockImageService = {
      validateAndProcessImage: vi.fn().mockResolvedValue({
        success: true,
        imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
      }),
    };
  });

  it("should render upload component", () => {
    const { container } = render(ImageUpload, {
      props: {
        onImageSelect: mockOnImageSelect,
      },
    });

    expect(container).toBeTruthy();
  });

  it("should handle file selection via input", async () => {
    const { container } = render(ImageUpload, {
      props: {
        onImageSelect: mockOnImageSelect,
      },
    });

    // Create a mock file
    const mockFile = new File(["test image content"], "test.jpg", {
      type: "image/jpeg",
    });

    // Find file input
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeTruthy();

    if (fileInput) {
      // Simulate file selection
      await fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      // Should call image service
      await waitFor(() => {
        expect(mockImageService.validateAndProcessImage).toHaveBeenCalled();
      });
    }
  });

  it("should handle drag and drop", async () => {
    const { container } = render(ImageUpload, {
      props: {
        onImageSelect: mockOnImageSelect,
      },
    });

    // Create mock file
    const mockFile = new File(["test image content"], "test.jpg", {
      type: "image/jpeg",
    });

    // Find drop zone
    const dropZone = container.querySelector("[data-testid='drop-zone'], .drop-zone, .upload-area");
    if (dropZone) {
      // Simulate drag over
      await fireEvent.dragOver(dropZone, {
        dataTransfer: { files: [mockFile] },
      });

      // Simulate drop
      await fireEvent.drop(dropZone, {
        dataTransfer: { files: [mockFile] },
      });

      // Should process the image
      await waitFor(() => {
        expect(mockImageService.validateAndProcessImage).toHaveBeenCalled();
      });
    }
  });

  it("should handle URL input", async () => {
    const { container } = render(ImageUpload, {
      props: {
        onImageSelect: mockOnImageSelect,
      },
    });

    // Find URL input and toggle button
    const urlInputs = container.querySelectorAll('input[type="url"], input[placeholder*="URL"]');
    const buttons = screen.getAllByRole("button");

    // Toggle URL input if needed
    const toggleButton = buttons.find(
      (button) =>
        button.textContent?.includes("URL") ||
        button.textContent?.includes("Ссылка") ||
        button.textContent?.includes("By URL"),
    );

    if (toggleButton) {
      await fireEvent.click(toggleButton);
    }

    if (urlInputs.length > 0) {
      const testUrl = "https://example.com/image.jpg";
      await fireEvent.input(urlInputs[0], { target: { value: testUrl } });

      // Submit URL form
      const submitButton = buttons.find((button) => {
        const isLoadButton = button.textContent?.includes("Load") || button.textContent?.includes("Загрузить");
        const buttonType = (button as HTMLButtonElement).type;
        return isLoadButton || buttonType === "submit";
      });

      if (submitButton) {
        await fireEvent.click(submitButton);

        // Should process the URL
        await waitFor(() => {
          expect(mockImageService.validateAndProcessImage).toHaveBeenCalled();
        });
      }
    }
  });

  it("should handle paste event", async () => {
    render(ImageUpload, {
      props: {
        onImageSelect: mockOnImageSelect,
      },
    });

    // Create mock clipboard data
    const mockClipboardData = {
      items: [
        {
          kind: "file",
          type: "image/jpeg",
          getAsFile: () => new File(["pasted image"], "pasted.jpg", { type: "image/jpeg" }),
        },
      ],
    };

    // Simulate paste event
    const pasteEvent = new ClipboardEvent("paste", {
      clipboardData: mockClipboardData as any,
    });

    document.dispatchEvent(pasteEvent);

    // Should process the pasted image
    await waitFor(() => {
      expect(mockImageService.validateAndProcessImage).toHaveBeenCalled();
    });
  });

  it("should show error for invalid image", async () => {
    // Mock image service to return error
    mockImageService.validateAndProcessImage.mockResolvedValue({
      success: false,
      error: "Invalid image format",
    });

    const { container } = render(ImageUpload, {
      props: {
        onImageSelect: mockOnImageSelect,
      },
    });

    const mockFile = new File(["invalid content"], "test.txt", {
      type: "text/plain",
    });

    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      await fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      // Should show error message
      await waitFor(() => {
        expect(container.textContent).toContain("Error");
      });
    }
  });

  it("should call onImageSelect when image is successfully processed", async () => {
    const mockImageUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

    // Mock successful image processing
    mockImageService.validateAndProcessImage.mockResolvedValue({
      success: true,
      imageUrl: mockImageUrl,
    });

    const { container } = render(ImageUpload, {
      props: {
        onImageSelect: mockOnImageSelect,
      },
    });

    const mockFile = new File(["test image content"], "test.jpg", {
      type: "image/jpeg",
    });

    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      await fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      // Should call onImageSelect with processed image
      await waitFor(() => {
        expect(mockOnImageSelect).toHaveBeenCalledWith(mockImageUrl);
      });
    }
  });

  it("should show loading state during processing", async () => {
    const { setLoading } = await import("$stores/uiStore");

    // Mock slow processing
    mockImageService.validateAndProcessImage.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: true,
                imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
              }),
            100,
          ),
        ),
    );

    const { container } = render(ImageUpload, {
      props: {
        onImageSelect: mockOnImageSelect,
      },
    });

    const mockFile = new File(["test image content"], "test.jpg", {
      type: "image/jpeg",
    });

    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      await fireEvent.change(fileInput, {
        target: { files: [mockFile] },
      });

      // Should show loading state
      expect(setLoading).toHaveBeenCalledWith(true);

      // Wait for processing to complete
      await waitFor(() => {
        expect(setLoading).toHaveBeenCalledWith(false);
      });
    }
  });
});
