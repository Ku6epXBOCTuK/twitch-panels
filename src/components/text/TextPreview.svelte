<script lang="ts">
  import type { TextItem } from "$lib/types/panel";
  import { panelStore } from "$stores/panelStore";
  import { Image, Layer, Stage, Text } from "svelte-konva";

  interface Props {
    textItem: TextItem;
    height: number;
  }

  let { textItem, height }: Props = $props();

  let bgImage: HTMLImageElement | undefined = $state(undefined);
  let currentPanel = $state($panelStore);

  $effect(() => {
    if (currentPanel?.backgroundImage && currentPanel.backgroundImage !== bgImage?.src) {
      loadImage(currentPanel.backgroundImage);
    }
  });

  function loadImage(src: string) {
    const img = document.createElement("img");
    img.onload = () => {
      bgImage = img;
    };
    img.src = src;
  }

  function getTextPosition() {
    const panelWidth = 320;
    const paddingX = textItem.paddingX || 0;
    const verticalOffset = textItem.verticalOffset || 0;
    const centerY = height / 2 + verticalOffset;

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

  let textPosition = $derived(getTextPosition());
</script>

<div class="text-preview">
  {#if bgImage}
    <div class="canvas-container">
      <Stage width={320} {height}>
        <Layer>
          <Image image={bgImage} width={320} {height} />
          <Text
            text={textItem.text}
            fontSize={textItem.fontSize}
            fill={textItem.color}
            fontFamily={textItem.fontFamily}
            x={textPosition.x}
            y={textPosition.y}
            align={textItem.textAlign}
            width={320 - textItem.paddingX * 2}
            offsetX={textItem.textAlign === "center" ? 0 : textItem.textAlign === "right" ? 0 : 0}
          />
        </Layer>
      </Stage>
    </div>
  {:else}
    <div class="loading">Загрузка...</div>
  {/if}
</div>

<style>
  .text-preview {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .canvas-container {
    display: flex;
    justify-content: center;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    border: 2px solid #e9ecef;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
    background: #f9f9f9;
    border-radius: 8px;
  }
</style>
