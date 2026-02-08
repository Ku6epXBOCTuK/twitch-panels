import ImageManager from "$components/image/ImageManager.svelte";
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

describe("ImageManager.svelte", () => {
  it("should render with card title", () => {
    render(ImageManager);
    expect(screen.getByText("Фоновое изображение")).toBeInTheDocument();
  });

  it("should render upload button", () => {
    render(ImageManager);
    expect(screen.getByText("Загрузить")).toBeInTheDocument();
  });

  it("should render edit button", () => {
    render(ImageManager);
    expect(screen.getByText("Редактировать")).toBeInTheDocument();
  });

  it("should render reset button", () => {
    render(ImageManager);
    expect(screen.getByText("Сбросить")).toBeInTheDocument();
  });

  it("should render brightness and contrast sliders", () => {
    render(ImageManager);
    expect(screen.getByText("Яркость")).toBeInTheDocument();
    expect(screen.getByText("Контраст")).toBeInTheDocument();
  });

  it("should have crop-editor layout", () => {
    render(ImageManager);
    const editor = document.querySelector(".crop-editor");
    expect(editor).toBeInTheDocument();
  });
});
