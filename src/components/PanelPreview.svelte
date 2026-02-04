<script lang="ts">
  import { panelStore } from "../stores/panelStore";
  import { uiStore, setCurrentStep } from "../stores/uiStore";
  import type { TextItem } from "../lib/types/panel";
  import { Stage, Layer, Image, Text } from "svelte-konva";
  import { Button } from "../lib/components/ui";

  let {
    onDownload,
  }: {
    onDownload?: () => void;
  } = $props();

  function handleUploadNewImage() {
    setCurrentStep("upload");
  }

  let backgroundImage: HTMLImageElement | undefined = $state(undefined);

  $effect(() => {
    const panel = $panelStore;
    if (panel?.backgroundImage && panel.backgroundImage !== backgroundImage?.src) {
      loadImage(panel.backgroundImage);
    }
  });

  function loadImage(src: string) {
    const img = document.createElement("img");
    img.onload = () => {
      backgroundImage = img;
    };
    img.src = src;
  }

  function handleDownload() {
    if (onDownload) {
      onDownload();
    }
  }

  function getTextPosition(textItem: TextItem) {
    const panel = $panelStore;
    if (!panel) return { x: 0, y: 0 };
    const panelWidth = 320;
    const paddingX = textItem.paddingX || 0;
    const verticalOffset = textItem.verticalOffset || 0;
    const centerY = panel.height / 2 + verticalOffset;

    switch (textItem.textAlign) {
      case "left":
        return { x: paddingX, y: centerY };
      case "right":
        return { x: panelWidth - paddingX, y: centerY };
      case "center":
      default:
        return { x: panelWidth / 2, y: centerY };
    }
  }
</script>

<div class="panel-preview">
  {#if $panelStore}
    <div class="preview-header">
      <Button variant="primary" onclick={handleDownload}>Скачать панель</Button>
      <Button variant="secondary" onclick={handleUploadNewImage}>Загрузить</Button>
    </div>
    <div class="preview-sections">
      <!-- Превью чистой картинки -->
      <div class="preview-section">
        <h3>Фон</h3>
        <div class="canvas-container">
          <Stage width={320} height={$panelStore.height}>
            <Layer>
              {#if backgroundImage}
                <Image image={backgroundImage} width={320} height={$panelStore.height} />
              {/if}
            </Layer>
          </Stage>
        </div>
      </div>

      <!-- Превью с текстом -->
      <div class="preview-section">
        <h3>Финальный результат</h3>
        <div class="canvas-container">
          <Stage width={320} height={$panelStore.height}>
            <Layer>
              {#if backgroundImage}
                <Image image={backgroundImage} width={320} height={$panelStore.height} />
              {/if}
              {#each $panelStore.texts || [] as textItem (textItem.id)}
                {@const textPosition = getTextPosition(textItem)}
                <Text
                  text={textItem.text}
                  fontSize={textItem.fontSize}
                  fill={textItem.color}
                  fontFamily={textItem.fontFamily}
                  x={textPosition.x}
                  y={textPosition.y}
                  align={textItem.textAlign}
                  width={320 - textItem.paddingX * 2}
                />
              {/each}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <p>Нет данных для предпросмотра</p>
    </div>
  {/if}
</div>

<style>
  .panel-preview {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .preview-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .preview-sections {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .preview-section h3 {
    margin: 0;
    color: #333;
    font-size: 1rem;
    font-weight: 500;
  }

  .canvas-container {
    display: flex;
    justify-content: center;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .empty-state {
    text-align: center;
    padding: 1.5rem;
    color: #666;
    background: #f9f9f9;
    border-radius: 6px;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.95rem;
  }
</style>
