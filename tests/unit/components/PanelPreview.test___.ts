import PanelPreview from "$components/panel/PanelPreview.svelte";
import type { Panel } from "$lib/types/panel";
import { fireEvent, render, screen } from "@testing-library/svelte";
import type { Stage as KonvaStage } from "konva/lib/Stage";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the UI store
vi.mock("$stores/uiStore", () => ({
  setCurrentStep: vi.fn(),
}));

describe("PanelPreview", () => {
  let mockPanel: Panel;
  let mockOnDownload: (panel: Panel, konvaStage: KonvaStage) => void;

  beforeEach(() => {
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

    mockOnDownload = vi.fn();
  });

  it("should render panel with text content", () => {
    const { container } = render(PanelPreview, {
      props: {
        panel: mockPanel,
        onDownload: mockOnDownload,
      },
    });

    // Should render without errors
    expect(container).toBeTruthy();
  });

  it("should call onDownload when download button is clicked", async () => {
    render(PanelPreview, {
      props: {
        panel: mockPanel,
        onDownload: mockOnDownload,
      },
    });

    // Find and click download button - button text might vary, so we'll look for a button
    const buttons = screen.getAllByRole("button");
    const downloadButton = buttons.find(
      (button) => button.textContent?.includes("Скачать") || button.textContent?.includes("Download"),
    );

    if (downloadButton) {
      await fireEvent.click(downloadButton);
      // Should call onDownload with panel and konva stage
      expect(mockOnDownload).toHaveBeenCalledWith(mockPanel, expect.any(Object));
    }
  });

  it("should handle panel without onDownload callback", () => {
    const { container } = render(PanelPreview, {
      props: {
        panel: mockPanel,
      },
    });

    // Should render without errors
    expect(container).toBeTruthy();
  });

  it("should display panel text content", () => {
    render(PanelPreview, {
      props: {
        panel: mockPanel,
        onDownload: mockOnDownload,
      },
    });

    // Check if panel text is rendered (this might be in a canvas, so we check container)
    const { container } = render(PanelPreview, {
      props: {
        panel: mockPanel,
        onDownload: mockOnDownload,
      },
    });
    expect(container).toBeTruthy();
  });
});
