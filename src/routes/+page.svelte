<script lang="ts">
  import { onMount } from "svelte";
  import { createPanelFromText, updatePanelText } from "../stores/panelStore";
  import { uiStore, setLoading, setCurrentStep } from "../stores/uiStore";

  import { exportService } from "../lib/services/exportService";
  import type { Panel } from "../lib/types/panel";

  import AppHeader from "../components/AppHeader.svelte";
  import ImageManager from "../components/ImageManager.svelte";
  import TextSection from "../components/TextSection.svelte";
  import BackgroundPreview from "../components/BackgroundPreview.svelte";
  import PanelsList from "../components/PanelsList.svelte";

  let uploadedImage = $state<string | null>(null);
  let panels = $state<Panel[]>([]);
  let texts = $state<Array<{ id: string; text: string }>>([]);
  let errorMessage = $state<string | null>(null);
  let backgroundImage = $state<string | null>(null);

  onMount(async () => {
    // Загружаем фоновое изображение по умолчанию
    try {
      const defaultBackground = "/backgrounds/b1.jpg";
      const response = await fetch(defaultBackground);
      if (!response.ok) throw new Error("Не удалось загрузить фоновое изображение");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        backgroundImage = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Ошибка загрузки фонового изображения:", error);
      errorMessage = "Не удалось загрузить фоновое изображение по умолчанию";
    }
  });

  function handleImageUpload(image: string) {
    uploadedImage = image;
    errorMessage = null;
    setCurrentStep("crop");
  }

  function handleUploadNewImage() {
    setCurrentStep("upload");
  }

  function handleCropComplete(croppedImage: string) {
    backgroundImage = croppedImage;
    // Обновляем все панели с новым фоновым изображением
    panels = panels.map(panel => ({
      ...panel,
      backgroundImage: croppedImage,
      updatedAt: new Date(),
    }));
    setCurrentStep("text");
  }

  function handleCropCancel() {
    uploadedImage = null;
    setCurrentStep("text");
  }

  function handleAddText(text: string) {
    texts = [...texts, { id: crypto.randomUUID(), text }];
    updatePanelsFromTexts();
  }

  function handleUpdateText(id: string, newText: string) {
    texts = texts.map(t => t.id === id ? { ...t, text: newText } : t);
    updatePanelsFromTexts();
  }

  function handleDeleteText(id: string) {
    texts = texts.filter(t => t.id !== id);
    updatePanelsFromTexts();
  }

  function updatePanelsFromTexts() {
    if (!backgroundImage) return;
    panels = texts.map(textItem => {
      const existingPanel = panels.find(p => p.texts[0]?.text === textItem.text);
      if (existingPanel) {
        return updatePanelText(existingPanel, textItem.text);
      }
      return createPanelFromText(backgroundImage!, textItem.text);
    });
  }

  async function handleDownload(panel: Panel) {
    try {
      setLoading(true);
      const result = await exportService.exportPanel(panel);

      if (!result.success) {
        errorMessage = result.error || "Ошибка экспорта панели";
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка экспорта панели";
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadAll() {
    try {
      setLoading(true);
      for (const panel of panels) {
        await exportService.exportPanel(panel);
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка экспорта панелей";
    } finally {
      setLoading(false);
    }
  }
</script>

<div class="app-container">
  <AppHeader onUploadNewImage={handleUploadNewImage} />

  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}

  <div class="app-content">
    <div class="main-section">
      <ImageManager
        currentStep={$uiStore.currentStep}
        uploadedImage={uploadedImage}
        onImageUpload={handleImageUpload}
        onCropComplete={handleCropComplete}
        onCropCancel={handleCropCancel}
      />
      {#if $uiStore.currentStep === "text"}
        <TextSection
          texts={texts}
          onTextAdd={handleAddText}
          onTextUpdate={handleUpdateText}
          onTextDelete={handleDeleteText}
        />
      {/if}
    </div>

    <div class="sidebar">
      {#if $uiStore.currentStep === "text"}
        <BackgroundPreview
          backgroundImage={backgroundImage}
          onUploadNewImage={handleUploadNewImage}
        />
        <PanelsList
          panels={panels}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
        />
      {/if}
    </div>
  </div>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .app-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .main-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ffcdd2;
    font-weight: 500;
  }

  @media (max-width: 1024px) {
    .app-content {
      grid-template-columns: 1fr;
    }

    .sidebar {
      order: -1;
    }
  }
</style>
