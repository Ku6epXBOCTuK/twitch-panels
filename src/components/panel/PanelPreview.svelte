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

  $effect(() => {
    if (stageComponent) {
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
    let stageToUse = konvaStage;

    if (!stageToUse && stageComponent) {
      stageToUse = stageComponent.node || stageComponent.stage || stageComponent._stage || stageComponent;

      if (stageToUse && typeof stageToUse.toBlob === "function") {
      } else {
        if (typeof stageComponent.toBlob === "function") {
          stageToUse = stageComponent;
        }
      }
    }

    if (onDownload && stageToUse) {
      onDownload(panel, stageToUse);
    }
  }

  function getTextPosition(textItem: TextItem) {
    const panelWidth = 320;
    const paddingX = textItem.paddingX || 20;
    const verticalOffset = textItem.verticalOffset || 0;
    const centerY = panel.height / 2 + verticalOffset;
    const textWidth = 300;

    let position;
    switch (textItem.textAlign) {
      case "left":
        position = { x: paddingX, y: centerY };
        break;
      case "right":
        position = { x: panelWidth - textWidth - paddingX, y: centerY };
        break;
      case "center":
      default:
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
    <div class="preview-section">
      <div class="canvas-container">
        <Stage width={320} height={panel.height} bind:this={stageComponent}>
          <Layer>
            {#if backgroundImage}
              <Image image={backgroundImage} width={320} height={panel.height} />
            {/if}
          </Layer>

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
