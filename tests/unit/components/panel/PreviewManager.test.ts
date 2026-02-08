import PreviewManager from "$components/panel/PreviewManager.svelte";
import { textsState } from "$states/texts.svelte";
import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";

describe("PreviewManager.svelte", () => {
  beforeEach(() => {
    textsState.texts.length = 0;
  });

  it("should render with empty state", () => {
    render(PreviewManager);
    expect(screen.getByText("Добавьте тексты для создания панелей")).toBeInTheDocument();
  });

  // it("should render title with badge", () => {
  //   textsState.addText("Test 1");
  //   render(PreviewManager);
  //   expect(screen.getByText("Панели")).toBeInTheDocument();
  // });

  // it("should render download buttons", () => {
  //   textsState.addText("Test");
  //   render(PreviewManager);
  //   expect(screen.getByText("Скачать всё")).toBeInTheDocument();
  //   expect(screen.getByText("Скачать")).toBeInTheDocument();
  // });

  // it("should render empty state when no texts", () => {
  //   render(PreviewManager);
  //   const emptyState = document.querySelector(".empty-state");
  //   expect(emptyState).toBeInTheDocument();
  // });

  // it("should have panel-viewer structure", () => {
  //   textsState.addText("Test");
  //   render(PreviewManager);
  //   const panelViewer = document.querySelector(".panel-viewer");
  //   expect(panelViewer).toBeInTheDocument();
  // });
});
