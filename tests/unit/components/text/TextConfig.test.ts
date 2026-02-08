import TextConfig from "$components/text/TextConfig.svelte";
import { render, screen, cleanup } from "@testing-library/svelte";
import { describe, expect, it, afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

describe("TextConfig.svelte", () => {
  it("should render with card title", () => {
    render(TextConfig);
    expect(screen.getByText("Настройки текста")).toBeInTheDocument();
  });

  it("should render all settings controls", () => {
    render(TextConfig);

    expect(screen.getByText("Размер")).toBeInTheDocument();
    expect(screen.getByText("Шрифт")).toBeInTheDocument();
    expect(screen.getByText("Цвет")).toBeInTheDocument();
    expect(screen.getByText("Выравнивание")).toBeInTheDocument();
    expect(screen.getByText("Отступы")).toBeInTheDocument();
    expect(screen.getByText("Смещение")).toBeInTheDocument();
  });

  it("should have correct structure with SettingsGrid", () => {
    render(TextConfig);
    const settingsGrid = document.querySelector(".settings-grid");
    expect(settingsGrid).toBeInTheDocument();
  });
});
