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
    try {
      backgroundImage = await imageService.loadDefaultBackground();
    } catch (error) {
      exportService.setErrorMessage("Не удалось загрузить фоновое изображение по умолчанию");
    }
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
