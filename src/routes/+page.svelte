<script lang="ts">
  import { onMount } from "svelte";
  import { createPanelFromText, updatePanelText } from "../stores/panelStore";
  import { uiStore, setLoading, setCurrentStep } from "../stores/uiStore";

  import { exportService } from "../lib/services/exportService";
  import type { Panel } from "../lib/types/panel";

  import ImageUpload from "../components/ImageUpload.svelte";
  import ImageCropper from "../components/ImageCropper.svelte";
  import TextManager from "../components/TextManager.svelte";
  import PanelPreview from "../components/PanelPreview.svelte";
  import { Button } from "../lib/components/ui";

  let uploadedImage = $state<string | null>(null);
  let panels = $state<Panel[]>([]);
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
    if (!backgroundImage) return;
    const newPanel = createPanelFromText(backgroundImage, text);
    panels = [...panels, newPanel];
  }

  function handleUpdateText(panelId: string, text: string) {
    panels = panels.map(panel => 
      panel.id === panelId ? updatePanelText(panel, text) : panel
    );
  }

  function handleDeletePanel(panelId: string) {
    panels = panels.filter(panel => panel.id !== panelId);
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
        <div class="text-section">
          <h2>Добавьте тексты для панелей</h2>
          <TextManager onTextAdd={handleAddText} />
        </div>
      {/if}
    </div>

    <div class="sidebar">
      {#if $uiStore.currentStep === "text" && panels.length > 0}
        <div class="panels-container">
          <div class="panels-header">
            <h2>Созданные панели ({panels.length})</h2>
            <Button variant="primary" onclick={handleDownloadAll}>Скачать все</Button>
          </div>
          <div class="panels-list">
            {#each panels as panel (panel.id)}
              <div class="panel-item">
                <PanelPreview 
                  panel={panel} 
                  onDownload={() => handleDownload(panel)}
                  onUpdate={(text) => handleUpdateText(panel.id, text)}
                  onDelete={() => handleDeletePanel(panel.id)}
                />
              </div>
            {/each}
          </div>
        </div>
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

  .text-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .text-section h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .panels-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .panels-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
  }

  .panels-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .panels-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .panel-item {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
    background: white;
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
