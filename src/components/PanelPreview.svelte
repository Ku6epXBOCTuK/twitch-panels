
<script lang="ts">
  import { onMount } from "svelte";
  import { panelStore } from "../stores/panelStore";
  import type { Panel } from "../lib/types/panel";
  import type { PageProps } from "./$types";

  export let onDownload?: () => void;

  let Stage: any = $state(undefined);
  let Layer: any = $state(undefined);
  let Image: any = $state(undefined);
  let Text: any = $state(undefined);

  let currentPanel = $state<Panel | null>(null);
  let backgroundImage: HTMLImageElement | undefined = $state(undefined);

  $effect(() => {
    currentPanel = $panelStore;
    if (currentPanel?.backgroundImage) {
      loadImage(currentPanel.backgroundImage);
    }
  });

  onMount(async () => {
    const svelteKonva = await import("svelte-konva");
    Stage = svelteKonva.Stage;
    Layer = svelteKonva.Layer;
    Image = svelteKonva.Image;
    Text = svelteKonva.Text;
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
</script>

<div class="panel-preview">
  <div class="preview-header">
    <h2>Предпросмотр панели</h2>
    {#if currentPanel}
      <button class="btn btn-primary" on:click={handleDownload}>
        Скачать
      </button>
    {/if}
  </div>

  {#if currentPanel && Stage}
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
            <Text
              text={textItem.text}
              fontSize={textItem.fontSize}
              fill={textItem.color}
              fontFamily={textItem.fontFamily}
              x={textItem.x}
              y={textItem.y}
              align="center"
              width={320}
            />
          {/each}
        </Layer>
      </Stage>
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
