<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import { ImageService } from "$lib/services/imageService";
  import type { ImageCropResult } from "$lib/types/panel";
  import { setLoading } from "$stores/uiStore";
  import CropperJS from "cropperjs";
  import { onMount } from "svelte";

  interface Props {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
  }

  let { imageSrc, onCropComplete, onCancel }: Props = $props();

  let imageElement: HTMLImageElement;
  let cropper: CropperJS | undefined = undefined;
  let isProcessing = $state(false);
  let errorMessage = $state<string | undefined>(undefined);

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
    console.log("initializeCropper called, imageElement:", !!imageElement, "CropperJS:", !!CropperJS);
    if (!imageElement || !CropperJS) {
      return;
    }

    cropper = new CropperJS(imageElement);
  }

  async function handleCrop() {
    if (!cropper) {
      return;
    }

    try {
      isProcessing = true;
      errorMessage = undefined;
      setLoading(true);

      console.log("Calling getCropperCanvas");
      const cropperCanvasElement = cropper.getCropperCanvas();
      console.log("CropperCanvas result:", cropperCanvasElement);
      console.log("CropperCanvas type:", typeof cropperCanvasElement);

      if (!cropperCanvasElement) {
        throw new Error("Не удалось получить обрезанное изображение");
      }

      // Используем метод $toCanvas для получения HTMLCanvasElement
      const canvas = await cropperCanvasElement.$toCanvas({
        width: 320,
      });

      if (!canvas) {
        throw new Error("Не удалось получить canvas");
      }

      // Теперь canvas - это обычный HTMLCanvasElement
      const croppedImage = canvas.toDataURL("image/png");

      // Validate cropped image
      const cropResult: ImageCropResult = {
        success: true,
        croppedImage,
      };

      onCropComplete(croppedImage);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка обрезки изображения";
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
    <img bind:this={imageElement} src={imageSrc} alt="" class="cropper-image" />
  </div>

  {#if errorMessage}
    <div class="error-message">
      <strong>Ошибка:</strong>
      {errorMessage}
    </div>
  {/if}

  <div class="cropper-actions">
    <Button variant="secondary" onclick={handleCancel} disabled={isProcessing}>Отмена</Button>
    <Button variant="primary" onclick={handleCrop} disabled={isProcessing} loading={isProcessing}>Применить</Button>
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

  /* Базовые стили для cropperjs */
  :global(.cropper-container) {
    direction: ltr;
    font-size: 0;
    line-height: 0;
    position: relative;
    touch-action: none;
    user-select: none;
  }

  :global(.cropper-container img) {
    display: block;
    height: 100%;
    image-orientation: 0deg;
    max-height: none !important;
    max-width: none !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: 100%;
  }

  :global(.cropper-wrap-box, .cropper-canvas, .cropper-drag-box, .cropper-crop-box, .cropper-modal) {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  :global(.cropper-wrap-box, .cropper-canvas) {
    overflow: hidden;
  }

  :global(.cropper-drag-box) {
    background-color: #fff;
    opacity: 0;
  }

  :global(.cropper-modal) {
    background-color: rgba(0, 0, 0, 0.5);
  }

  :global(.cropper-crop-box) {
    border-color: rgba(0, 123, 255, 0.5);
  }
</style>
