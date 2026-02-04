<script lang="ts">
  import { uiStore, setCurrentStep } from "../../stores/uiStore";
  import type { Panel } from "$lib/types/panel";

  type TextItem = Panel["texts"][0];
  import { Stage, Layer, Image, Text } from "svelte-konva";
  import Button from "../ui/Button.svelte";

  interface Props {
    panel: Panel;
    onDownload?: () => void;
  }

  let { panel, onDownload }: Props = $props();

  let backgroundImage: HTMLImageElement | undefined = $state(undefined);

  function handleUploadNewImage() {
    setCurrentStep("upload");
  }

  $effect(() => {
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
  <div class="preview-header">
    <div class="panel-title">{panel.texts[0]?.text || "Без названия"}</div>
    <Button variant="primary" size="sm" onclick={handleDownload}>Скачать</Button>
  </div>
  <div class="preview-sections">
    <!-- Превью с текстом -->
    <div class="preview-section">
      <div class="canvas-container">
        <Stage width={320} height={panel.height}>
          <Layer>
            {#if backgroundImage}
              <Image image={backgroundImage} width={320} height={panel.height} />
            {/if}
            {#each panel.texts || [] as textItem (textItem.id)}
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
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .panel-title {
    font-weight: 600;
    color: #333;
    font-size: 1.1rem;
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

  .canvas-container {
    display: flex;
    justify-content: center;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }
</style>
