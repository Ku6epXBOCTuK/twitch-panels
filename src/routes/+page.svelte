<script lang="ts">
  import { panelStore, createEmptyPanel } from "../stores/panelStore";
  import { uiStore, setLoading, setCurrentStep } from "../stores/uiStore";

  import { exportService } from "../lib/services/exportService";
  import type { Panel } from "../lib/types/panel";

  import ImageUpload from "../components/ImageUpload.svelte";
  import ImageCropper from "../components/ImageCropper.svelte";
  import TextManager from "../components/TextManager.svelte";
  import PanelPreview from "../components/PanelPreview.svelte";

  let uploadedImage = $state<string | null>(null);
  let croppedImage = $state<string | null>(null);
  let currentPanel = $state<Panel | null>(null);
  let errorMessage = $state<string | null>(null);

  $effect(() => {
    currentPanel = $panelStore;
  });

  function handleImageUpload(image: string) {
    uploadedImage = image;
    errorMessage = null;
    setCurrentStep("crop");
  }

  function handleCropComplete(croppedImage: string) {
    croppedImage = croppedImage;

    // Создаем новую панель с обрезанным изображением
    const newPanel = createEmptyPanel();
    newPanel.backgroundImage = croppedImage;

    panelStore.set(newPanel);
    currentPanel = newPanel;

    setCurrentStep("text");
  }

  function handleCropCancel() {
    uploadedImage = null;
    setCurrentStep("upload");
  }

  function handleTextUpdate(texts: Panel["texts"]) {
    if (currentPanel) {
      const updatedPanel = {
        ...currentPanel,
        texts,
        updatedAt: new Date(),
      };
      panelStore.set(updatedPanel);
    }
  }

  async function handleDownload() {
    if (!currentPanel) {
      errorMessage = "Нет панели для скачивания";
      return;
    }

    try {
      setLoading(true);
      const result = await exportService.exportPanel(currentPanel);

      if (!result.success) {
        errorMessage = result.error || "Ошибка экспорта панели";
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка экспорта панели";
    } finally {
      setLoading(false);
    }
  }


</script>

<div class="app-container">
  <div class="app-header">
    <h1>Twitch Panels Creator</h1>
  </div>

  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}

  <div class="app-content">
    <div class="main-section">
      {#if $uiStore.currentStep === "upload"}
        <ImageUpload onImageSelect={handleImageUpload} />
      {:else if $uiStore.currentStep === "crop" && uploadedImage}
        <ImageCropper imageSrc={uploadedImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
      {:else if $uiStore.currentStep === "text"}
        <TextManager onTextUpdate={handleTextUpdate} />
      {/if}
    </div>

    <div class="sidebar">
      {#if $uiStore.currentStep === "text"}
        <PanelPreview onDownload={handleDownload} />
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

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .app-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
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

  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
    background: #f9f9f9;
    border-radius: 8px;
    border: 2px solid #e9ecef;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .btn-primary {
    background: white;
    color: #667eea;
  }

  .btn-primary:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
