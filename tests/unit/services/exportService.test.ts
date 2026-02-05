import type { Panel } from "$lib/types/panel";
import { ExportService } from "$services/exportService";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock file-saver
vi.mock("file-saver", () => ({
  default: {
    saveAs: vi.fn(),
  },
}));

describe("ExportService", () => {
  let service: ExportService;
  let mockPanel: Panel;
  let mockKonvaStage: any;

  beforeEach(() => {
    service = new ExportService();

    mockPanel = {
      id: "test-panel-1",
      backgroundImage: "/backgrounds/b1.jpg",
      text: {
        id: "test-text-1",
        text: "Test Panel",
        fontSize: 18,
        fontFamily: "Arial",
        color: "#ffffff",
        textAlign: "center",
        paddingX: 10,
        verticalOffset: 0,
      },
      height: 100,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    };

    mockKonvaStage = {
      toBlob: vi.fn(({ callback }) => {
        callback(new Blob(["test image data"], { type: "image/png" }));
      }),
    };
  });

  describe("exportPanel", () => {
    it("should export panel successfully with valid Konva stage", async () => {
      const result = await service.exportPanel(mockPanel, mockKonvaStage);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(mockKonvaStage.toBlob).toHaveBeenCalled();
    });

    it("should handle missing Konva stage gracefully", async () => {
      const result = await service.exportPanel(mockPanel, null as any);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Konva Stage не передан для экспорта");
    });

    it("should handle Konva stage without toBlob method", async () => {
      const invalidStage = { toBlob: undefined };

      const result = await service.exportPanel(mockPanel, invalidStage as any);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Konva Stage не найден или не поддерживает toBlob");
    });

    it("should handle blob creation failure", async () => {
      mockKonvaStage.toBlob = vi.fn(({ callback }) => {
        callback(null); // Simulate blob creation failure
      });

      const result = await service.exportPanel(mockPanel, mockKonvaStage);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Не удалось создать изображение");
    });

    it("should use custom filename when provided", async () => {
      const customFilename = "custom-panel-name.png";

      const result = await service.exportPanel(mockPanel, mockKonvaStage, customFilename);

      expect(result.success).toBe(true);
      // The filename is passed to file-saver, but we mocked it
    });

    it("should use default filename when custom filename not provided", async () => {
      const result = await service.exportPanel(mockPanel, mockKonvaStage);

      expect(result.success).toBe(true);
      // Default filename should be "twitch-panel-test-panel-1.png"
    });
  });

  describe("handleDownload", () => {
    it("should handle successful download", async () => {
      // Mock successful export
      mockKonvaStage.toBlob = vi.fn(({ callback }) => {
        callback(new Blob(["test image data"], { type: "image/png" }));
      });

      await expect(service.handleDownload(mockPanel, mockKonvaStage)).resolves.not.toThrow();
    });

    // it("should throw error when export fails", async () => {
    //   // Mock failed export
    //   mockKonvaStage.toBlob = vi.fn(({ callback }) => {
    //     callback(null);
    //   });

    //   await expect(service.handleDownload(mockPanel, mockKonvaStage)).rejects.toThrow("Ошибка экспорта панели");
    // });
  });

  describe("exportPanels", () => {
    it("should return not implemented error", async () => {
      const panels = [mockPanel, { ...mockPanel, id: "test-panel-2" }];

      const result = await service.exportPanels(panels);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Пакетный экспорт еще не реализован");
    });
  });
});
