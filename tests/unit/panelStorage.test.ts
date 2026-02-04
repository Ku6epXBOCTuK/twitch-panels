import type { Panel } from "$lib/types/panel";
import { PanelStorage } from "$lib/utils/panelStorage";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the error handler to avoid console noise during tests
vi.mock("$lib/utils/errorHandler", () => ({
  logError: vi.fn(),
  handleError: vi.fn((error: any, message: string) => `${message}: ${error}`),
}));

describe("PanelStorage", () => {
  let storage: PanelStorage;
  let mockPanel: Panel;
  let mockLocalStorage: any;

  beforeEach(() => {
    storage = new PanelStorage();
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

    // Create a properly typed mock for localStorage
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    // Replace window.localStorage with our mock
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("savePanel", () => {
    it("should save a new panel successfully", () => {
      const result = storage.savePanel(mockPanel);

      expect(result.success).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("twitch-panels", expect.stringContaining("test-panel-1"));
    });

    it("should update existing panel", () => {
      // Save initial panel
      storage.savePanel(mockPanel);

      // Update panel
      const updatedPanel = { ...mockPanel, height: 150 };
      const result = storage.savePanel(updatedPanel);

      expect(result.success).toBe(true);

      // Get the last call to localStorage.setItem
      const calls = mockLocalStorage.setItem.mock.calls;
      const savedData = JSON.parse(calls[calls.length - 1][1]);
      expect(savedData[0].height).toBe(150);
    });

    it("should limit panels to MAX_PANELS count", () => {
      // Create and save 51 panels (exceeding MAX_PANELS = 50)
      const panels = Array.from({ length: 51 }, (_, i) => ({
        ...mockPanel,
        id: `panel-${i}`,
      }));

      // Mock localStorage to return the saved data for getAllPanels
      let savedData: any[] = [];
      mockLocalStorage.setItem.mockImplementation((key: string, value: string) => {
        if (key === "twitch-panels") {
          savedData = JSON.parse(value);
        }
      });

      mockLocalStorage.getItem.mockImplementation((key: string) => {
        if (key === "twitch-panels") {
          return JSON.stringify(savedData);
        }
        return null;
      });

      panels.forEach((panel) => storage.savePanel(panel));

      // Check the final state by calling getAllPanels
      const finalPanels = storage.getAllPanels();
      expect(finalPanels.length).toBe(50);
      expect(finalPanels[0].id).toBe("panel-50"); // Most recent panel
    });

    it("should handle localStorage errors gracefully", () => {
      // Mock localStorage to throw an error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("Storage full");
      });

      const result = storage.savePanel(mockPanel);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Ошибка сохранения панели");
    });
  });

  describe("getAllPanels", () => {
    it("should return empty array when no panels exist", () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const panels = storage.getAllPanels();

      expect(panels).toEqual([]);
    });

    it("should return saved panels", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel]));

      const panels = storage.getAllPanels();

      expect(panels).toHaveLength(1);
      expect(panels[0]).toEqual(mockPanel);
    });

    it("should filter out invalid panels", () => {
      const validPanel = mockPanel;
      const invalidPanel = {
        id: "invalid-1",
        backgroundImage: "/backgrounds/b2.jpg",
        // Missing required text property
        height: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([validPanel, invalidPanel]));

      const panels = storage.getAllPanels();

      expect(panels).toHaveLength(1);
      expect(panels[0]).toEqual(validPanel);
    });

    it("should handle corrupted localStorage data", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json");

      const panels = storage.getAllPanels();

      expect(panels).toEqual([]);
    });
  });

  describe("getPanelById", () => {
    it("should return panel by id", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel]));

      const panel = storage.getPanelById("test-panel-1");

      expect(panel).toEqual(mockPanel);
    });

    it("should return undefined for non-existent panel", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel]));

      const panel = storage.getPanelById("non-existent");

      expect(panel).toBeUndefined();
    });

    it("should handle errors gracefully", () => {
      // Mock localStorage to throw an error
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const panel = storage.getPanelById("test-panel-1");

      expect(panel).toBeUndefined();
    });
  });

  describe("deletePanel", () => {
    it("should delete panel by id", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel]));

      const result = storage.deletePanel("test-panel-1");

      expect(result.success).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("twitch-panels", "[]");
    });

    it("should succeed when panel does not exist", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel]));

      const result = storage.deletePanel("non-existent");

      expect(result.success).toBe(true);
      // Should still save the unchanged array
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it("should handle localStorage errors", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel]));

      // Mock localStorage to throw an error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = storage.deletePanel("test-panel-1");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Ошибка удаления панели");
    });
  });

  describe("clearAll", () => {
    it("should clear all panels", () => {
      const result = storage.clearAll();

      expect(result.success).toBe(true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("twitch-panels");
    });

    it("should handle localStorage errors", () => {
      // Mock localStorage to throw an error
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = storage.clearAll();

      expect(result.success).toBe(false);
      expect(result.error).toContain("Ошибка очистки хранилища");
    });
  });

  describe("getPanelCount", () => {
    it("should return correct panel count", () => {
      expect(storage.getPanelCount()).toBe(0);

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel]));
      expect(storage.getPanelCount()).toBe(1);

      const secondPanel = { ...mockPanel, id: "test-panel-2" };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel, secondPanel]));
      expect(storage.getPanelCount()).toBe(2);
    });
  });

  describe("hasSpaceForNewPanel", () => {
    it("should return true when under limit", () => {
      expect(storage.hasSpaceForNewPanel()).toBe(true);

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPanel]));
      expect(storage.hasSpaceForNewPanel()).toBe(true);
    });

    it("should return false when at limit", () => {
      // Create and save 50 panels (MAX_PANELS limit)
      const panels = Array.from({ length: 50 }, (_, i) => ({
        ...mockPanel,
        id: `panel-${i}`,
      }));

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(panels));

      expect(storage.hasSpaceForNewPanel()).toBe(false);
    });
  });

  describe("panel validation", () => {
    it("should validate correct panel structure", () => {
      const validPanel = mockPanel;

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([validPanel]));
      const panels = storage.getAllPanels();

      expect(panels).toHaveLength(1);
      expect(panels[0]).toEqual(validPanel);
    });

    it("should reject panel with invalid height", () => {
      const invalidPanel = {
        ...mockPanel,
        height: -100, // Negative height
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([invalidPanel]));
      const panels = storage.getAllPanels();

      expect(panels).toHaveLength(0);
    });

    it("should reject panel with height exceeding maximum", () => {
      const invalidPanel = {
        ...mockPanel,
        height: 2000, // Exceeds PANEL_HEIGHT_MAX (1000)
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([invalidPanel]));
      const panels = storage.getAllPanels();

      expect(panels).toHaveLength(0);
    });

    it("should reject panel with missing required properties", () => {
      const invalidPanel = {
        id: "invalid-panel",
        // Missing backgroundImage
        text: mockPanel.text,
        height: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([invalidPanel]));
      const panels = storage.getAllPanels();

      expect(panels).toHaveLength(0);
    });
  });
});
