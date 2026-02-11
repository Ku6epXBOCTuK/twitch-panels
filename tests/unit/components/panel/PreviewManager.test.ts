import PreviewManager from "$components/panel/PreviewManager.svelte";
import { downloadService } from "$services/downloadService";
import { konvaStageState } from "$states/konvaStage.svelte";
import { STATE_DATA } from "$states/persisted.svelte";
import { textsState } from "$states/texts.svelte";
import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("$services/downloadService", () => ({
  downloadService: {
    downloadAll: vi.fn(),
    downloadPanel: vi.fn(),
  },
}));

vi.mock("./Preview.svelte", () => ({
  default: { render: () => ({}) },
}));
describe("PreviewManager Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    textsState[STATE_DATA] = [];
  });

  it("should show empty state by aria-label when no texts", () => {
    render(PreviewManager);
    expect(screen.getByLabelText(/Empty texts info/i)).toBeInTheDocument();
  });

  it("should toggle navigation buttons availability based on texts length", async () => {
    textsState[STATE_DATA] = ["1", "2"];
    render(PreviewManager);

    const nextBtn = screen.getByRole("button", { name: /next slide/i });
    const prevBtn = screen.getByRole("button", { name: /previous slide/i });

    expect(nextBtn).not.toBeDisabled();
    expect(prevBtn).toBeDisabled();
  });

  it("should send correct data to downloadAll service", async () => {
    const user = userEvent.setup();
    textsState[STATE_DATA] = ["Apple", "Banana"];
    render(PreviewManager);

    await user.click(screen.getByRole("button", { name: /download all/i }));

    expect(downloadService.downloadAll).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ filename: "Apple" }),
        expect.objectContaining({ filename: "Banana" }),
      ]),
    );
  });

  it("should call downloadPanel with current active text", async () => {
    const user = userEvent.setup();
    textsState[STATE_DATA] = ["First", "Second"];
    konvaStageState.stage = { node: { id: "stage-ref" } } as any;

    render(PreviewManager);

    // Переходим на второй слайд
    await user.click(screen.getByRole("button", { name: /next slide/i }));
    await user.click(screen.getByRole("button", { name: /download current/i }));

    expect(downloadService.downloadPanel).toHaveBeenCalledWith(expect.anything(), "Second");
  });

  it("should return to empty state when texts are removed", async () => {
    textsState[STATE_DATA] = ["Temp"];
    render(PreviewManager);

    expect(screen.queryByLabelText(/Empty texts info/i)).not.toBeInTheDocument();

    textsState[STATE_DATA] = [];

    await waitFor(() => {
      expect(screen.getByLabelText(/Empty texts info/i)).toBeInTheDocument();
    });
  });

  it("should automatically correct current index on items deletion", async () => {
    const user = userEvent.setup();
    textsState[STATE_DATA] = ["1", "2", "3"];
    render(PreviewManager);

    // Уходим на последний слайд
    await user.click(screen.getByRole("button", { name: /next slide/i }));
    await user.click(screen.getByRole("button", { name: /next slide/i }));

    // Удаляем элементы. Индекс должен упасть с 2 до 0
    textsState[STATE_DATA] = ["Only one left"];

    await waitFor(() => {
      // Проверяем, что кнопка "Next" заблокировалась (значит мы на последнем/единственном)
      expect(screen.getByRole("button", { name: /next slide/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /previous slide/i })).toBeDisabled();
    });
  });
});
