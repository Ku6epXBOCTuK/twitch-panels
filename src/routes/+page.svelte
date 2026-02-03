
<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { panelStore, createEmptyPanel } from "../stores/panelStore";
  import { uiStore, setLoading, setCurrentStep } from "../stores/uiStore";
  import { panelStorage } from "../lib/utils/panelStorage";
  import { exportService } from "../lib/services/exportService";
  import type { Panel } from "../lib/types/panel";

  let ImageUpload: any = $state(undefined);
  let ImageCropper: any = $state(undefined);
  let TextManager: any = $state(undefined);
  let PanelPreview: any = $state(undefined);
  let PanelList: any = $state(undefined);

  onMount(async () => {
    if (browser) {
      [ImageUpload, ImageCropper, TextManager, PanelPreview, PanelList] = await Promise.all([
        import("../components/ImageUpload.svelte"),
        import("../components/ImageCropper.svelte"),
        import("../components/TextManager.svelte"),
        import("../components/PanelPreview.svelte"),
        import("../components/PanelList.svelte")
      ]);
    }
  });

  let uploadedImage = $state<string | null>(null);
  let croppedImage = $state<string | null>(null);
  let currentPanel = $state<Panel | null>(null);
  let errorMessage = $state<string | null>(null);

  $effect(() => {
    currentPanel = $panelStore;
  });

  onMount(() => {
    // Загружаем сохраненные панели
    const savedPanels = panelStorage.getAllPanels();
    if (savedPanels.length > 0) {
      // Если есть сохраненные панели, можно загрузить последнюю
      // panelStore.set(savedPanels[0]);
    }
  });

  function handleImageUpload(image: string) {
    uploadedImage = image;
    errorMessage = null;
    uiStore.setCurrentStep("crop");
  }

  function handleCropComplete(croppedImage: string) {
    croppedImage = croppedImage;

    // Создаем новую панель с обрезанным изображением
    const newPanel = createEmptyPanel();
    newPanel.backgroundImage = croppedImage;

    panelStore.set(newPanel);
    currentPanel = newPanel;

    // Сохраняем панель
    panelStorage.savePanel(newPanel);

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
      panelStorage.savePanel(updatedPanel);
    }
  }

  function handlePanelSelect(panel: Panel) {
    panelStore.set(panel);
    currentPanel = panel;
    setCurrentStep("preview");
  }

  function handlePanelDelete(panelId: string) {
    if (currentPanel?.id === panelId) {
      panelStore.set(null);
      currentPanel = null;
      setCurrentStep("upload");
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

  function handleNewPanel() {
    panelStore.set(null);
    currentPanel = null;
    uploadedImage = null;
    croppedImage = null;
    setCurrentStep("upload");
  }
</script>

<div class="app-container">
  <div class="app-header">
    <h1>Twitch Panels Creator</h1>
    <button class="btn btn-primary" onclick={handleNewPanel}>Новая панель</button>
  </div>

  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}

  <div class="app-content">
    <div class="main-section">
      {#if $uiStore.currentStep === "upload"}
        {#if ImageUpload}
          {@const Upload = ImageUpload.default}
          <svelte:component this={Upload} onImageSelect={handleImageUpload} />
        {/if}
      {:else if $uiStore.currentStep === "crop" && uploadedImage}
        {#if ImageCropper}
          {@const Cropper = ImageCropper.default}
          <svelte:component 
            this={Cropper}
            imageSrc={uploadedImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        {/if}
      {:else if $uiStore.currentStep === "text"}
        {#if TextManager}
          {@const Manager = TextManager.default}
          <svelte:component this={Manager} onTextUpdate={handleTextUpdate} />
        {/if}
      {:else if $uiStore.currentStep === "preview"}
        {#if PanelPreview}
          {@const Preview = PanelPreview.default}
          <svelte:component this={Preview} onDownload={handleDownload} />
        {/if}
      {/if}
    </div>

    <div class="sidebar">
      {#if PanelList}
        {@const List = PanelList.default}
        <svelte:component 
          this={List}
          onPanelSelect={handlePanelSelect}
          onPanelDelete={handlePanelDelete}
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
    grid-template-columns: 1fr 350px;
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
