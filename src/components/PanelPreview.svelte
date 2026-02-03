
<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { panelStore } from "../stores/panelStore";
  import type { Panel } from "../lib/types/panel";
  import type { PageProps } from "./$types";

  let { onDownload }: {
    onDownload?: () => void;
  } = $props();

  let Stage: any;
  let Layer: any;
  let Image: any;
  let Text: any;

  let currentPanel = $state<Panel | null>(null);
  let backgroundImage: HTMLImageElement | undefined = $state(undefined);

  $effect(() => {
    currentPanel = $panelStore;
    if (currentPanel?.backgroundImage) {
      loadImage(currentPanel.backgroundImage);
    }
  });

  onMount(async () => {
    if (browser) {
      const svelteKonva = await import("svelte-konva");
      Stage = svelteKonva.Stage;
      Layer = svelteKonva.Layer;
      Image = svelteKonva.Image;
      Text = svelteKonva.Text;
    }
  });

  function loadImage(src: string) {
    const img = new Image();
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

  function getTextPosition(textItem: any) {
    const panelWidth = 320;
    const paddingX = textItem.paddingX || 0;
    const verticalOffset = textItem.verticalOffset || 0;
    const centerY = currentPanel!.height / 2 + verticalOffset;

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
  <div class="preview-header">
    <h2>Предпросмотр панели</h2>
    {#if currentPanel}
      <button class="btn btn-primary" onclick={handleDownload}>
        Скачать
      </button>
    {/if}
  </div>

  {#if currentPanel && Stage}
    <div class="preview-sections">
      <!-- Превью чистой картинки -->
      <div class="preview-section">
        <h3>Чистая картинка</h3>
        <div class="canvas-container">
          <Stage width={320} height={currentPanel.height}>
            <Layer>
              {#if backgroundImage}
                <Image
                  image={backgroundImage}
                  width={320}
                  height={currentPanel.height}
                />
              {/if}
            </Layer>
          </Stage>
        </div>
      </div>

      <!-- Превью с текстом -->
      <div class="preview-section">
        <h3>С текстом</h3>
        <div class="canvas-container">
          <Stage width={320} height={currentPanel.height}>
        <Layer>
          {#if backgroundImage}
            <Image
              image={backgroundImage}
              width={320}
              height={currentPanel.height}
            />
          {/if}
          {#each currentPanel.texts as textItem (textItem.id)}
            {@const textPosition = getTextPosition(textItem)}
            <Text
              text={textItem.text}
              fontSize={textItem.fontSize}
              fill={textItem.color}
              fontFamily={textItem.fontFamily}
              x={textPosition.x}
              y={textPosition.y}
              align={textItem.textAlign}
              width={320 - (textItem.paddingX * 2)}
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
    gap: 1.5rem;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .preview-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }

  .preview-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preview-section h3 {
    margin: 0;
    color: #333;
    font-size: 1.25rem;
  }

  .canvas-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .empty-state p {
    margin: 0;
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

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background: #0056b3;
  }
</style>
