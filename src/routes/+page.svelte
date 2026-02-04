<script lang="ts">
  import type { Panel, TextItem } from "$lib/types/panel";
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

  // Create a derived store for text settings to avoid cyclic dependencies
  let textSettings = $derived($textSettingsStore);

  // Listen for text settings changes and update all panels
  let previousSettings = $state<string>("");

  $effect(() => {
    // Only depend on the derived settings value
    const currentSettings = textSettings;
    const settingsString = JSON.stringify(currentSettings);

    // Only update if settings actually changed
    if (settingsString !== previousSettings) {
      // Update panels with new settings
      const updatedPanels = panels.map((panel) => ({
        ...panel,
        text: { ...panel.text, ...currentSettings },
      }));

      // Use a microtask to avoid synchronous update issues
      Promise.resolve().then(() => {
        if (panels.length > 0) {
          panels = updatedPanels;
        }
      });

      previousSettings = settingsString;
    }
  });

  onMount(async () => {
    // Initialize with default texts for common Twitch panels
    const defaultTexts = [
      { id: crypto.randomUUID(), text: "About" },
      { id: crypto.randomUUID(), text: "Links" },
    ];
    texts = defaultTexts;

    // Load background image
    try {
      const loadedBackground = await imageService.loadDefaultBackground();
      backgroundImage = loadedBackground;
    } catch (error) {
      console.error("Failed to load default background");
      exportService.setErrorMessage("Не удалось загрузить фоновое изображение по умолчанию");
    }

    // Create panels from texts (with or without background)
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

  async function handleDownload(panel: Panel) {
    await exportService.handleDownload(panel);
  }

  async function handleDownloadAll() {
    await exportService.handleDownloadAll(panels);
  }
</script>

<AppContainer
  errorMessage={exportService.getErrorMessage()}
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
