<script lang="ts">
  import { uiStore, setCurrentStep } from "../stores/uiStore";
  import type { Panel } from "../lib/types/panel";
  import { Stage, Layer, Image, Text } from "svelte-konva";
  import { Button, IconButton } from "../lib/components/ui";

  let {
    panel,
    onDownload,
    onUpdate,
    onDelete,
  }: {
    panel: Panel;
    onDownload?: () => void;
    onUpdate?: (text: string) => void;
    onDelete?: () => void;
  } = $props();

  let backgroundImage: HTMLImageElement | undefined = $state(undefined);
  let editingText = $state(false);
  let editText = $state("");

  function handleUploadNewImage() {
    setCurrentStep("upload");
  }

  function handleEdit() {
    editText = panel.texts[0]?.text || "";
    editingText = true;
  }

  function handleSaveEdit() {
    if (onUpdate && editText.trim()) {
      onUpdate(editText.trim());
    }
    editingText = false;
  }

  function handleCancelEdit() {
    editingText = false;
    editText = "";
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
    {#if editingText}
      <div class="edit-controls">
        <input
          type="text"
          bind:value={editText}
          class="edit-input"
          onkeypress={(e) => e.key === "Enter" && handleSaveEdit()}
        />
        <Button variant="primary" size="sm" onclick={handleSaveEdit}>✓</Button>
        <Button variant="secondary" size="sm" onclick={handleCancelEdit}>✕</Button>
      </div>
    {:else}
      <div class="panel-title">{panel.texts[0]?.text || "Без названия"}</div>
      <div class="panel-actions">
        <IconButton variant="secondary" onclick={handleEdit} ariaLabel="Редактировать">✎</IconButton>
        <Button variant="primary" size="sm" onclick={onDownload}>Скачать</Button>
        {#if onDelete}
          <IconButton variant="danger" onclick={onDelete} ariaLabel="Удалить">🗑</IconButton>
        {/if}
      </div>
    {/if}
  </div>
    <div class="preview-sections">
      <!-- Превью чистой картинки -->
      <div class="preview-section">
        <h3>Фон</h3>
        <div class="canvas-container">
          <Stage width={320} height={panel.height}>
            <Layer>
              {#if backgroundImage}
                <Image image={backgroundImage} width={320} height={panel.height} />
              {/if}
            </Layer>
          </Stage>
        </div>
      </div>

      <!-- Превью с текстом -->
      <div class="preview-section">
        <h3>Финальный результат</h3>
        <div class="canvas-container">
          <Stage width={320} height={panel.height}>
            <Layer>
              {#if backgroundImage}
                <Image image={backgroundImage} width={320} height={panel.height} />
              {/if}
              {#each panel.texts || [] as textItem (textItem.id)}
                {@const textPosition = getTextPosition(textItem)}
                <Text
                  text={editingText ? editText : textItem.text}
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

  .panel-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .edit-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex: 1;
  }

  .edit-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  .edit-input:focus {
    outline: none;
    border-color: #007bff;
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
