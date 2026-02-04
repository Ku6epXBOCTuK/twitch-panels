<script lang="ts">
  import type { Panel, TextItem } from "$lib/types/panel";
  import type { Stage as KonvaStage } from "konva/lib/Stage";
  import { onMount } from "svelte";
  import { exportService } from "../services/exportService";
  import { imageService } from "../services/imageService";
  import { panelService } from "../services/panelService";
  import { textSettingsStore } from "../stores/panelStore";

  import AppContainer from "../components/layout/AppContainer.svelte";

  let uploadedImage = $state<string | undefined>(undefined);
  let panels = $state<Panel[]>([]);
  let texts = $state<Array<{ id: string; text: string }>>([]);
  let backgroundImage = $state<string | undefined>(undefined);

  let textSettings = $derived($textSettingsStore);

  let previousSettings = $state<string>("");

  $effect(() => {
    const currentSettings = textSettings;
    const settingsString = JSON.stringify(currentSettings);

    if (settingsString !== previousSettings) {
      const updatedPanels = panels.map((panel) => ({
        ...panel,
        text: { ...panel.text, ...currentSettings },
      }));

      Promise.resolve().then(() => {
        if (panels.length > 0) {
          panels = updatedPanels;
        }
      });

      previousSettings = settingsString;
    }
  });

  onMount(async () => {
    const defaultTexts = [
      { id: crypto.randomUUID(), text: "About" },
      { id: crypto.randomUUID(), text: "Links" },
    ];
    texts = defaultTexts;

    try {
      const loadedBackground = await imageService.loadDefaultBackground();
      backgroundImage = loadedBackground;
    } catch (error) {
      console.error("Failed to load default background");
      exportService.setErrorMessage("Не удалось загрузить фоновое изображение по умолчанию");
    }

    const initialPanels = panelService.updatePanelsFromTexts(texts, [], backgroundImage || "");
    panels = initialPanels;
  });

  function handleImageUpload(image: string) {
    uploadedImage = image;
    imageService.handleImageUpload(image);
  }

  function handleUploadNewImage() {
    imageService.handleUploadNewImage();
  }

  function handleCropComplete(croppedImage: string) {
    backgroundImage = croppedImage;
    uploadedImage = undefined;
    imageService.handleCropComplete(croppedImage);
    panels = panelService.updatePanelsBackground(panels, croppedImage);
    panels = panelService.updatePanelsFromTexts(texts, panels, croppedImage);
  }

  function handleCropCancel() {
    uploadedImage = undefined;
    imageService.handleCropCancel();
  }

  function handleAddText(text: string, settings?: Partial<TextItem>) {
    texts = panelService.addText(texts, text);
    panels = panelService.updatePanelsFromTexts(texts, panels, backgroundImage!, settings);
  }

  function handleUpdateText(id: string, newText: string) {
    texts = panelService.updateText(texts, id, newText);
    panels = panelService.updatePanelsFromTexts(texts, panels, backgroundImage!);
  }

  function handleDeleteText(id: string) {
    texts = panelService.deleteText(texts, id);
    panels = panelService.updatePanelsFromTexts(texts, panels, backgroundImage!);
  }

  async function handleDownload(panel: Panel, konvaStage: KonvaStage) {
    await exportService.handleDownload(panel, konvaStage);
  }

  async function handleDownloadAll() {
    await exportService.handleDownloadAll(panels);
  }
</script>

<AppContainer
  errorMessage={exportService.getErrorMessage() || undefined}
  {uploadedImage}
  {texts}
  {backgroundImage}
  {panels}
  onUploadNewImage={handleUploadNewImage}
  onImageUpload={handleImageUpload}
  onCropComplete={handleCropComplete}
  onCropCancel={handleCropCancel}
  onTextAdd={handleAddText}
  onTextUpdate={handleUpdateText}
  onTextDelete={handleDeleteText}
  onDownload={handleDownload}
  onDownloadAll={handleDownloadAll}
/>
