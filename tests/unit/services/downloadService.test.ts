import { DownloadService, type DownloadItem } from "$services/downloadService";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { Stage } from "konva/lib/Stage";
import { assert, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("file-saver", () => {
  return {
    saveAs: vi.fn(),
  };
});

vi.mock("jszip", () => {
  const mockZipInstance = {
    file: vi.fn().mockReturnThis(),
    generateAsync: vi.fn().mockResolvedValue(new Blob([])),
  };

  return {
    default: vi.fn(function () {
      return mockZipInstance;
    }),
  };
});

describe("DownloadService", () => {
  let service: DownloadService;
  let mockKonvaStage: Stage;

  beforeEach(() => {
    service = new DownloadService();
    vi.clearAllMocks();

    mockKonvaStage = {
      toBlob: vi.fn(async ({ callback }) => {
        callback(new Blob(["test image data"], { type: "image/png" }));
      }),
    } as unknown as Stage;
  });

  describe("downloadPanel", () => {
    it("should export panel successfully", async () => {
      const result = await service.downloadPanel(mockKonvaStage, "test-panel-1");

      const [blobArg, fileNameArg] = vi.mocked(saveAs).mock.calls[0];

      expect(result.success).toBe(true);
      expect(mockKonvaStage.toBlob).toHaveBeenCalled();
      expect(blobArg instanceof Blob).toBe(true);
      expect(fileNameArg).toBe("test-panel-1.png");
    });

    it("should handle Konva stage without toBlob method", async () => {
      const invalidStage = { toBlob: undefined };

      const result = await service.downloadPanel(
        invalidStage as unknown as Stage,
        "test-panel-1.png",
      );

      assert(result.success === false);

      expect(result.error).toContain("Konva Stage не найден или не поддерживает toBlob");
    });

    it("should handle blob creation failure", async () => {
      mockKonvaStage.toBlob = vi.fn(async ({ callback }) => {
        callback(null);
      });

      const result = await service.downloadPanel(mockKonvaStage, "test-panel-1.png");

      assert(result.success === false);

      expect(result.error).toContain("Не удалось создать изображение");
    });
  });

  describe("downloadAllPanels", () => {
    it("should handle successful download of multiple panels", async () => {
      const panels: Array<DownloadItem> = [{ filename: "test-panel-1", stage: mockKonvaStage }];
      const result = await service.downloadAll(panels);
      const [blobArg, fileNameArg] = vi.mocked(saveAs).mock.calls[0];
      const zipInstance = vi.mocked(JSZip).mock.instances[0];

      expect(result.success).toBe(true);
      expect(mockKonvaStage.toBlob).toHaveBeenCalled();
      expect(blobArg instanceof Blob).toBe(true);
      expect(fileNameArg).toBe("panels.zip");
      expect(zipInstance.file).toHaveBeenCalledTimes(1);
      expect(zipInstance.file).toHaveBeenCalledWith("test-panel-1.png", expect.anything());
    });

    it("should add to zip all files", async () => {
      const panels: Array<DownloadItem> = [
        { filename: "test-panel-1", stage: mockKonvaStage },
        { filename: "test-panel-2", stage: mockKonvaStage },
        { filename: "test-panel-3", stage: mockKonvaStage },
        { filename: "test-panel-4", stage: mockKonvaStage },
        { filename: "test-panel-5", stage: mockKonvaStage },
      ];
      const result = await service.downloadAll(panels);
      const zipInstance = vi.mocked(JSZip).mock.instances[0];

      expect(result.success).toBe(true);
      expect(mockKonvaStage.toBlob).toHaveBeenCalledTimes(5);
      expect(zipInstance.file).toHaveBeenCalledTimes(5);
      expect(zipInstance.file).toHaveBeenCalledWith("test-panel-1.png", expect.anything());
      expect(zipInstance.file).toHaveBeenCalledWith("test-panel-2.png", expect.anything());
      expect(zipInstance.file).toHaveBeenCalledWith("test-panel-3.png", expect.anything());
      expect(zipInstance.file).toHaveBeenCalledWith("test-panel-4.png", expect.anything());
      expect(zipInstance.file).toHaveBeenCalledWith("test-panel-5.png", expect.anything());
    });

    it("should handle failure", async () => {
      const invalidStage = { toBlob: undefined };
      const panels: Array<DownloadItem> = [
        { filename: "test-panel-1", stage: invalidStage as unknown as Stage },
      ];
      const result = await service.downloadAll(panels);

      assert(result.success === false);

      expect(result.error).toContain("Ошибка сохранения архива");
    });
  });
});
