<script lang="ts">
  import type { Panel } from "$lib/types/panel";
  import { onMount } from "svelte";
  import { exportService } from "../services/exportService";
  import { imageService } from "../services/imageService";
  import { panelService } from "../services/panelService";

  import AppContainer from "../components/layout/AppContainer.svelte";

  let uploadedImage = $state<string | undefined>(undefined);
  let panels = $state<Panel[]>([]);
  let texts = $state<Array<{ id: string; text: string }>>([]);
  let backgroundImage = $state<string | undefined>(undefined);

  onMount(async () => {
    // Initialize with default texts for common Twitch panels
    console.log("[INIT] Creating default texts...");
    const defaultTexts = [
      { id: crypto.randomUUID(), text: "About" },
      { id: crypto.randomUUID(), text: "Links" },
    ];
    texts = defaultTexts;
    console.log("[INIT] Default texts created:", texts);

    // Load background image
    try {
      console.log("[INIT] Loading default background...");
      const loadedBackground = await imageService.loadDefaultBackground();
      console.log("[INIT] Background loaded:", loadedBackground);
      backgroundImage = loadedBackground;
    } catch (error) {
      console.error("[INIT] Error loading background:", error);
      exportService.setErrorMessage("Не удалось загрузить фоновое изображение по умолчанию");
    }

    // Create panels from texts (with or without background)
    console.log("[INIT] Creating panels from texts...");
    const initialPanels = panelService.updatePanelsFromTexts(texts, [], backgroundImage || "");
    console.log("[INIT] Panels created:", initialPanels);
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

  function handleAddText(text: string) {
    texts = panelService.addText(texts, text);
    panels = panelService.updatePanelsFromTexts(texts, panels, backgroundImage!);
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
