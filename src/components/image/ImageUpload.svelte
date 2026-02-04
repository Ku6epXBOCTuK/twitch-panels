<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import type { ImageUploadResult } from "$lib/types/panel";
  import { handleError } from "$lib/utils/errorHandler";
  import { clearError, setCurrentStep, setLoading, uiStore } from "$stores/uiStore";
  import { onMount } from "svelte";
  import { imageService } from "../../services/imageService";

  interface Props {
    onImageSelect: (image: string) => void;
  }

  let { onImageSelect }: Props = $props();

  let dropZone = $state<HTMLElement | undefined>(undefined);
  let fileInput = $state<HTMLInputElement | undefined>(undefined);
  let urlInput = $state<HTMLInputElement | undefined>(undefined);
  let urlForm = $state<HTMLFormElement | undefined>(undefined);

  let isDragOver = $state(false);
  let showUrlInput = $state(false);
  let uploadedImage = $state<string | undefined>(undefined);
  let errorMessage = $state<string | undefined>(undefined);

  const uiError = $derived($uiStore.error);

  onMount(() => {
    setupPasteHandler();
    setupDragAndDrop();
  });

  function setupPasteHandler() {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }

  function setupDragAndDrop() {
    if (!dropZone) return;

    dropZone!.addEventListener("dragover", handleDragOver);
    dropZone!.addEventListener("dragleave", handleDragLeave);
    dropZone!.addEventListener("drop", handleDrop);

    return () => {
      dropZone!.removeEventListener("dragover", handleDragOver);
      dropZone!.removeEventListener("dragleave", handleDragLeave);
      dropZone!.removeEventListener("drop", handleDrop);
    };
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await handleFileUpload(file);
  }

  async function handleFileUpload(file: File) {
    try {
      setLoading(true);
      clearError();
      const result: ImageUploadResult = await imageService.handleFileUpload(file);

      if (result.success && result.image) {
        uploadedImage = result.image;
        onImageSelect(result.image);
        setCurrentStep("crop");
      } else {
        errorMessage = result.error || "Ошибка загрузки файла";
      }
    } catch (error) {
      errorMessage = handleError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePaste(e: ClipboardEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      clearError();

      const result: ImageUploadResult = await imageService.handlePasteUpload(e);

      if (result.success && result.image) {
        uploadedImage = result.image;

        onImageSelect(result.image);
        setCurrentStep("crop");
      } else {
        errorMessage = result.error || "Ошибка вставки изображения";
      }
    } catch (error) {
      errorMessage = handleError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUrlSubmit(e: Event) {
    e.preventDefault();

    if (!urlInput?.value.trim()) return;

    try {
      setLoading(true);
      clearError();

      const result: ImageUploadResult = await imageService.handleUrlUpload(urlInput.value.trim());

      if (result.success && result.image) {
        uploadedImage = result.image;

        onImageSelect(result.image);
        setCurrentStep("crop");
        showUrlInput = false;
      } else {
        errorMessage = result.error || "Ошибка загрузки изображения";
      }
    } catch (error) {
      errorMessage = handleError(error);
    } finally {
      setLoading(false);
    }
  }

  function triggerFileInput() {
    fileInput?.click();
  }

  function resetUpload() {
    uploadedImage = undefined;
    errorMessage = undefined;
    showUrlInput = false;
    setCurrentStep("upload");
  }
</script>

<div class="image-upload-container">
  {#if uploadedImage}
    <div class="uploaded-image-preview">
      <img src={uploadedImage} alt="Uploaded preview" />
      <div class="preview-actions">
        <Button variant="secondary" onclick={resetUpload}>Загрузить другое</Button>
      </div>
    </div>
  {:else}
    <div
      bind:this={dropZone}
      class="drop-zone {isDragOver ? 'drag-over' : ''} {uiError ? 'error' : ''}"
      role="button"
      tabindex="0"
      onclick={triggerFileInput}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          triggerFileInput();
        }
      }}
    >
      <div class="drop-zone-content">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>

        <h3>Загрузите изображение</h3>
        <p>Перетащите файл сюда, нажмите для выбора, или вставьте через Ctrl+V</p>

        <div class="upload-methods">
          <Button
            variant="primary"
            onclick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}>Выбрать файл</Button
          >

          <Button variant="secondary" onclick={() => (showUrlInput = !showUrlInput)}>
            {showUrlInput ? "Скрыть" : "По URL"}
          </Button>
        </div>

        {#if showUrlInput}
          <form bind:this={urlForm} onsubmit={handleUrlSubmit} class="url-input-form">
            <input
              bind:this={urlInput}
              type="url"
              placeholder="https://example.com/image.jpg"
              required
              class="url-input"
            />
            <Button type="submit" variant="primary" disabled={$uiStore.isLoading} loading={$uiStore.isLoading}
              >Загрузить</Button
            >
          </form>
        {/if}

        <div class="upload-tips">
          <p>• Поддерживаемые форматы: JPG, PNG, WebP, GIF</p>
          <p>• Максимальный размер: 10MB</p>
          <p>• Или вставьте изображение через Ctrl+V</p>
        </div>
      </div>
    </div>

    <input
      bind:this={fileInput}
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
      style="display: none;"
      onchange={(e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileUpload(file);
      }}
    />
  {/if}
  {#if errorMessage}
    <div class="error-message">
      <strong>Ошибка:</strong>
      {errorMessage}
    </div>
  {/if}

  {#if $uiStore.isLoading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Загрузка...</p>
    </div>
  {/if}
</div>

<style>
  .image-upload-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .drop-zone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f9f9f9;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .drop-zone:hover {
    border-color: #007bff;
    background: #f0f8ff;
  }

  .drop-zone.drag-over {
    border-color: #007bff;
    background: #e3f2fd;
    transform: scale(1.02);
  }

  .drop-zone.error {
    border-color: #dc3545;
    background: #ffebee;
  }

  .drop-zone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .upload-icon {
    width: 48px;
    height: 48px;
    color: #666;
  }

  .drop-zone h3 {
    margin: 0;
    color: #333;
    font-size: 1.2rem;
  }

  .drop-zone p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }

  .upload-methods {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .url-input-form {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    width: 100%;
  }

  .url-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .upload-tips {
    font-size: 0.8rem;
    color: #666;
    margin-top: 1rem;
  }

  .upload-tips p {
    margin: 0.25rem 0;
  }

  .uploaded-image-preview {
    text-align: center;
  }

  .uploaded-image-preview img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .preview-actions {
    margin-top: 1rem;
  }

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 0.75rem;
    border-radius: 4px;
    margin-top: 1rem;
    border: 1px solid #ffcdd2;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
