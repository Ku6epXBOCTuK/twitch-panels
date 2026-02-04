<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import type { Panel, TextItem } from "$lib/types/panel";
  import { setCurrentStep } from "$stores/uiStore";
  import { Image, Layer, Stage, Text } from "svelte-konva";

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
    console.log(
      "[PanelPreview] Effect triggered. Panel background:",
      panel?.backgroundImage,
      "Current image src:",
      backgroundImage?.src,
    );
    if (panel?.backgroundImage && panel.backgroundImage !== backgroundImage?.src) {
      console.log("[PanelPreview] Loading new background image:", panel.backgroundImage);
      loadImage(panel.backgroundImage);
    }
  });

  function loadImage(src: string) {
    console.log("[PanelPreview] Starting to load image:", src);
    const img = document.createElement("img");
    img.onload = () => {
      console.log("[PanelPreview] Image loaded successfully:", src);
      backgroundImage = img;
    };
    img.onerror = (error) => {
      console.error("[PanelPreview] Failed to load image:", src, error);
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
    const paddingX = textItem.paddingX || 20; // Default padding
    const verticalOffset = textItem.verticalOffset || 0;
    const centerY = panel.height / 2 + verticalOffset;
    const textWidth = 300; // Width of the text area

    let position;
    switch (textItem.textAlign) {
      case "left":
        position = { x: paddingX, y: centerY };
        break;
      case "right":
        // For right alignment, position the right edge of text at panel edge minus padding
        position = { x: panelWidth - textWidth - paddingX, y: centerY };
        break;
      case "center":
      default:
        // For center alignment, center the text area within the panel
        position = { x: (panelWidth - textWidth) / 2, y: centerY };
        break;
    }

    return position;
  }
</script>

<div class="panel-preview">
  <div class="preview-header">
    <div class="panel-title">{panel.text?.text || "Без названия"}</div>
    <Button variant="primary" size="sm" onclick={handleDownload}>Скачать</Button>
  </div>
  <div class="preview-sections">
    <!-- Превью с текстом -->
    <div class="preview-section">
      <div class="canvas-container">
        <Stage width={320} height={panel.height}>
          <!-- Background layer -->
          <Layer>
            {#if backgroundImage}
              <Image image={backgroundImage} width={320} height={panel.height} />
            {/if}
          </Layer>

          <!-- Text layer (renders above background) -->
          <Layer>
            {#if panel.text}
              {@const textPosition = getTextPosition(panel.text)}

              <Text
                text={panel.text.text}
                fontSize={panel.text.fontSize || 24}
                fill={panel.text.color || "#ffffff"}
                fontFamily={panel.text.fontFamily || "Arial"}
                x={textPosition.x}
                y={textPosition.y}
                align={panel.text.textAlign || "center"}
                width={300}
              />
            {/if}
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
