import type { Panel } from "../lib/types/panel";
import { exportService as exportPanelService } from "../lib/services/exportService";
import { setLoading } from "../stores/uiStore";

export class ExportService {
  private static instance: ExportService;
  private errorMessage: string | undefined = undefined;

  private constructor() {}

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  getErrorMessage(): string | undefined {
    return this.errorMessage;
  }

  setErrorMessage(message: string | undefined): void {
    this.errorMessage = message;
  }

  async handleDownload(panel: Panel): Promise<void> {
    try {
      setLoading(true);
      const result = await exportPanelService.exportPanel(panel);

      if (!result.success) {
        this.errorMessage = result.error || "Ошибка экспорта панели";
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Ошибка экспорта панели";
    } finally {
      setLoading(false);
    }
  }

  async handleDownloadAll(panels: Panel[]): Promise<void> {
    try {
      setLoading(true);
      for (const panel of panels) {
        await exportPanelService.exportPanel(panel);
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : "Ошибка экспорта панелей";
    } finally {
      setLoading(false);
    }
  }
}

export const exportService = ExportService.getInstance();
