import type { Panel } from "$lib/types/panel";
import {
  createEmptyPanel,
  panelStore,
  textSettingsStore,
  updateAllTextSettings,
  updatePanel,
} from "$stores/panelStore";
import { get } from "svelte/store";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock uuid
vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid-12345"),
}));

describe("panelStore", () => {
  beforeEach(() => {
    // Reset stores to initial state
    panelStore.set(undefined);
    textSettingsStore.set({
      fontSize: 18,
      fontFamily: "Arial",
      color: "#ffffff",
      textAlign: "left",
      paddingX: 10,
      verticalOffset: 0,
    });
  });

  describe("panelStore", () => {
    it("should initialize with undefined value", () => {
      const store = get(panelStore);
      expect(store).toBeUndefined();
    });

    it("should update panel value", () => {
      const mockPanel: Panel = {
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

      panelStore.set(mockPanel);

      const store = get(panelStore);
      expect(store).toEqual(mockPanel);
    });
  });

  describe("textSettingsStore", () => {
    it("should initialize with default text settings", () => {
      const settings = get(textSettingsStore);
      expect(settings).toEqual({
        fontSize: 18,
        fontFamily: "Arial",
        color: "#ffffff",
        textAlign: "left",
        paddingX: 10,
        verticalOffset: 0,
      });
    });

    it("should update text settings", () => {
      const newSettings = {
        fontSize: 24,
        fontFamily: "Helvetica",
        color: "#000000",
      };

      updateAllTextSettings(newSettings);

      const settings = get(textSettingsStore);
      expect(settings.fontSize).toBe(24);
      expect(settings.fontFamily).toBe("Helvetica");
      expect(settings.color).toBe("#000000");
      // Other properties should remain unchanged
      expect(settings.textAlign).toBe("left");
      expect(settings.paddingX).toBe(10);
      expect(settings.verticalOffset).toBe(0);
    });
  });

  describe("createEmptyPanel", () => {
    // it("should create panel with default settings", () => {
    //   const panel = createEmptyPanel();

    //   expect(panel.id).toBe("test-uuid-12345");
    //   expect(panel.backgroundImage).toBe("");
    //   expect(panel.height).toBe(320); // PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT
    //   expect(panel.text.text).toBe("");
    //   expect(panel.text.fontSize).toBe(18);
    //   expect(panel.text.fontFamily).toBe("Arial");
    //   expect(panel.text.color).toBe("#ffffff");
    //   expect(panel.text.textAlign).toBe("center");
    //   expect(panel.text.paddingX).toBe(10);
    //   expect(panel.text.verticalOffset).toBe(0);
    //   expect(panel.createdAt).toBeInstanceOf(Date);
    //   expect(panel.updatedAt).toBeInstanceOf(Date);
    // });

    it("should create panel with custom height", () => {
      const customHeight = 500;
      const panel = createEmptyPanel(customHeight);

      expect(panel.height).toBe(customHeight);
    });
  });

  describe("updatePanel", () => {
    it("should update panel properties and timestamp", () => {
      const originalPanel: Panel = {
        id: "test-panel-1",
        backgroundImage: "/backgrounds/b1.jpg",
        text: {
          id: "test-text-1",
          text: "Original Text",
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

      const updates = {
        backgroundImage: "/backgrounds/b2.jpg",
        height: 150,
        text: {
          ...originalPanel.text,
          text: "Updated Text",
          fontSize: 24,
        },
      };

      const updatedPanel = updatePanel(originalPanel, updates);

      expect(updatedPanel.backgroundImage).toBe("/backgrounds/b2.jpg");
      expect(updatedPanel.height).toBe(150);
      expect(updatedPanel.text.text).toBe("Updated Text");
      expect(updatedPanel.text.fontSize).toBe(24);
      // Unchanged properties should remain the same
      expect(updatedPanel.id).toBe("test-panel-1");
      expect(updatedPanel.text.fontFamily).toBe("Arial");
      expect(updatedPanel.text.color).toBe("#ffffff");
      // updatedAt should be changed to current time
      expect(updatedPanel.updatedAt.getTime()).toBeGreaterThan(originalPanel.updatedAt.getTime());
      // createdAt should remain unchanged
      expect(updatedPanel.createdAt).toEqual(originalPanel.createdAt);
    });

    it("should handle empty updates", () => {
      const originalPanel: Panel = {
        id: "test-panel-1",
        backgroundImage: "/backgrounds/b1.jpg",
        text: {
          id: "test-text-1",
          text: "Original Text",
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

      const updatedPanel = updatePanel(originalPanel, {});

      // Should only update the updatedAt timestamp
      expect(updatedPanel).toEqual({
        ...originalPanel,
        updatedAt: expect.any(Date),
      });
      expect(updatedPanel.updatedAt.getTime()).toBeGreaterThan(originalPanel.updatedAt.getTime());
    });
  });
});
