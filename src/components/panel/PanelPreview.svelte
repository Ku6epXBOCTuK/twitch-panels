<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import type { Panel, TextItem } from "$lib/types/panel";
  import { setCurrentStep } from "$stores/uiStore";
  import type { Stage as KonvaStage } from "konva/lib/Stage";
  import { Image, Layer, Stage, Text } from "svelte-konva";

  interface Props {
    panel: Panel;
    onDownload?: (panel: Panel, konvaStage: KonvaStage) => void;
  }

  let { panel, onDownload }: Props = $props();

  let backgroundImage: HTMLImageElement | undefined = $state(undefined);
  let konvaStage: KonvaStage | null = $state(null);
  let stageComponent: any = $state(null);

  // Get the Konva stage after component mounts
  $effect(() => {
    if (stageComponent) {
      // According to svelte-konva docs, access the node property to get the underlying Konva Stage
      konvaStage = stageComponent.node;
    }
  });

  function handleUploadNewImage() {
    setCurrentStep("upload");
  }

  $effect(() => {
    if (panel?.backgroundImage && panel.backgroundImage !== backgroundImage?.src) {
      loadImage(panel.backgroundImage);
    }
  });

  function loadImage(src: string) {
    // Remove verbose logging - image data is too large for console
    const img = document.createElement("img");
    img.onload = () => {
      backgroundImage = img;
    };
    img.onerror = (error) => {
      console.error("[PanelPreview] Failed to load background image");
    };
    img.src = src;
  }

  function handleDownload() {
    console.log("[PanelPreview] handleDownload called");
    console.log("[PanelPreview] onDownload exists:", onDownload ? true : false);
    console.log("[PanelPreview] konvaStage exists:", konvaStage ? true : false);
    console.log("[PanelPreview] konvaStage value:", konvaStage);
    console.log("[PanelPreview] stageComponent exists:", stageComponent ? true : false);

    // Try different approaches to get the Konva stage for download
    let stageToUse = konvaStage;

    if (!stageToUse && stageComponent) {
      console.log("[PanelPreview] konvaStage is null, trying to get stage from stageComponent");

      // Try different properties that might contain the Konva stage
      stageToUse = stageComponent.node || stageComponent.stage || stageComponent._stage || stageComponent;

      // Check if this is actually a valid Konva stage
      if (stageToUse && typeof stageToUse.toBlob === "function") {
        console.log("[PanelPreview] Found valid Konva stage in stageComponent");
      } else {
        console.log("[PanelPreview] stageComponent itself might be the Konva stage");
        // Maybe stageComponent IS the Konva stage - check if it has toBlob
        if (typeof stageComponent.toBlob === "function") {
          stageToUse = stageComponent;
          console.log("[PanelPreview] ✅ stageComponent IS the Konva stage");
        } else {
          console.log("[PanelPreview] ❌ Could not find valid Konva stage");
        }
      }
    }

    if (onDownload && stageToUse) {
      console.log("[PanelPreview] Calling onDownload with panel and stage");
      onDownload(panel, stageToUse);
    } else {
      console.error("[PanelPreview] Cannot download - onDownload or valid stage is missing");
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
        <Stage width={320} height={panel.height} bind:this={stageComponent}>
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
