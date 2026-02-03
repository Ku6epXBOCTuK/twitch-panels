
<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import type { ImageCropResult } from "../lib/types/panel";
  import { ImageService } from "../lib/services/imageService";
  import { uiStore, setLoading } from "../stores/uiStore";
  
  let Cropper: any = $state(undefined);

  onMount(async () => {
    if (browser) {
      const cropperModule = await import("cropperjs");
      Cropper = cropperModule.default;
      
      // Импортируем стили только на клиенте

      
      // Инициализируем cropper после загрузки
      initializeCropper();
    }
  });

  let { imageSrc, onCropComplete, onCancel }: {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
  } = $props();

  let imageElement: HTMLImageElement;
  let cropper: Cropper | null = null;
  let isProcessing = $state(false);
  let errorMessage = $state<string | null>(null);

  let imageService = new ImageService();

  onMount(() => {
    initializeCropper();
    return () => {
      if (cropper) {
        cropper.destroy();
      }
    };
  });

  function initializeCropper() {
    if (!imageElement || !Cropper) return;

    cropper = new Cropper(imageElement, {
      aspectRatio: NaN, // Allow any aspect ratio
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 1,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
      minCropBoxWidth: 320,
      minCropBoxHeight: 50,
      responsive: true,
    });
  }

  async function handleCrop() {
    if (!cropper) return;

    try {
      isProcessing = true;
      errorMessage = null;
      setLoading(true);

      const canvas = cropper.getCroppedCanvas({
        width: 320,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!canvas) {
        throw new Error("Не удалось получить обрезанное изображение");
      }

      const croppedImage = canvas.toDataURL("image/png");

      // Validate cropped image
      const cropResult: ImageCropResult = {
        success: true,
        croppedImage,
      };

      onCropComplete(croppedImage);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка обрезки изображения";
      console.error("Crop error:", error);
    } finally {
      isProcessing = false;
      setLoading(false);
    }
  }

  function handleCancel() {
    if (cropper) {
      cropper.destroy();
    }
    onCancel();
  }
</script>

<div class="cropper-container">
  <div class="cropper-wrapper">
    <img
      bind:this={imageElement}
      src={imageSrc}
      alt=""
      class="cropper-image"
    />
  </div>

  {#if errorMessage}
    <div class="error-message">
      <strong>Ошибка:</strong> {errorMessage}
    </div>
  {/if}

  <div class="cropper-actions">
    <button
      class="btn btn-secondary"
      onclick={handleCancel}
      disabled={isProcessing}
    >
      Отмена
    </button>
    <button
      class="btn btn-primary"
      onclick={handleCrop}
      disabled={isProcessing}
    >
      {isProcessing ? "Обработка..." : "Применить"}
    </button>
  </div>

  <div class="cropper-info">
    <p>💡 Изображение будет обрезано до ширины 320px</p>
  </div>
</div>

<style>
  .cropper-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .cropper-wrapper {
    position: relative;
    width: 100%;
    max-height: 600px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .cropper-image {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .cropper-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .cropper-info {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ffcdd2;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #545b62;
  }

  :global(.cropper-view-box),
  :global(.cropper-face) {
    border-radius: 0;
  }

  :global(.cropper-line) {
    background-color: rgba(0, 123, 255, 0.5);
  }

  :global(.cropper-point) {
    background-color: #007bff;
  }
</style>
