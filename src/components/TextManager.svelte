
<script lang="ts">
  import { panelStore, addTextToPanel, updateTextInPanel, removeTextFromPanel } from "../stores/panelStore";
  import type { TextItem } from "../lib/types/panel";
  import { v4 as uuidv4 } from "uuid";

  let { onTextUpdate }: {
    onTextUpdate: (texts: TextItem[]) => void;
  } = $props();

  let currentPanel = $state($panelStore);
  let selectedTextId = $state<string | null>(null);
  let newText = $state("");
  let errorMessage = $state<string | null>(null);

  // Subscribe to panel store
  $effect(() => {
    currentPanel = $panelStore;
  });

  function handleAddText() {
    if (!currentPanel) return;

    if (!newText.trim()) {
      errorMessage = "Введите текст";
      return;
    }

    if (newText.length > 100) {
      errorMessage = "Текст не должен превышать 100 символов";
      return;
    }

    try {
      errorMessage = null;
      const updatedPanel = addTextToPanel(currentPanel, newText.trim());
      panelStore.set(updatedPanel);
      onTextUpdate(updatedPanel.texts);
      newText = "";
      selectedTextId = updatedPanel.texts[updatedPanel.texts.length - 1].id;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка добавления текста";
    }
  }

  function handleUpdateText(textId: string, updates: Partial<TextItem>) {
    if (!currentPanel) return;

    try {
      errorMessage = null;
      const updatedPanel = updateTextInPanel(currentPanel, textId, updates);
      panelStore.set(updatedPanel);
      onTextUpdate(updatedPanel.texts);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка обновления текста";
    }
  }

  function handleRemoveText(textId: string) {
    if (!currentPanel) return;

    try {
      errorMessage = null;
      const updatedPanel = removeTextFromPanel(currentPanel, textId);
      panelStore.set(updatedPanel);
      onTextUpdate(updatedPanel.texts);

      if (selectedTextId === textId) {
        selectedTextId = null;
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка удаления текста";
    }
  }

  function handleSelectText(textId: string) {
    selectedTextId = textId;
  }
</script>

<div class="text-manager">
  <div class="text-manager-header">
    <h2>Управление текстом</h2>
  </div>

  <div class="add-text-section">
    <div class="input-group">
      <input
        type="text"
        bind:value={newText}
        placeholder="Введите текст..."
        class="text-input"
        maxlength="100"
      />
      <button class="btn btn-primary" on:click={handleAddText}>
        Добавить
      </button>
    </div>
    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}
  </div>

  {#if currentPanel && currentPanel.texts.length > 0}
    <div class="text-list">
      {#each currentPanel.texts as textItem (textItem.id)}
        <div
          class="text-item {selectedTextId === textItem.id ? 'selected' : ''}"
          on:click={() => handleSelectText(textItem.id)}
        >
          <div class="text-preview">
            <span class="text-content">{textItem.text}</span>
            <button
              class="btn-icon btn-delete"
              on:click|stopPropagation={() => handleRemoveText(textItem.id)}
              aria-label="Удалить текст"
            >
              ×
            </button>
          </div>

          {#if selectedTextId === textItem.id}
            <div class="text-controls">
              <div class="control-group">
                <label>
                  Размер шрифта:
                  <input
                    type="range"
                    min="10"
                    max="72"
                    step="1"
                    value={textItem.fontSize}
                    on:input={(e) => handleUpdateText(textItem.id, {
                      fontSize: parseInt(e.target.value)
                    })}
                  />
                  <span class="value-display">{textItem.fontSize}px</span>
                </label>
              </div>

              <div class="control-group">
                <label>
                  Цвет:
                  <input
                    type="color"
                    value={textItem.color}
                    on:input={(e) => handleUpdateText(textItem.id, {
                      color: e.target.value
                    })}
                  />
                </label>
              </div>

              <div class="control-group">
                <label>
                  Позиция X:
                  <input
                    type="range"
                    min="0"
                    max="320"
                    step="1"
                    value={textItem.x}
                    on:input={(e) => handleUpdateText(textItem.id, {
                      x: parseInt(e.target.value)
                    })}
                  />
                  <span class="value-display">{textItem.x}px</span>
                </label>
              </div>

              <div class="control-group">
                <label>
                  Позиция Y:
                  <input
                    type="range"
                    min="0"
                    max={currentPanel.height}
                    step="1"
                    value={textItem.y}
                    on:input={(e) => handleUpdateText(textItem.id, {
                      y: parseInt(e.target.value)
                    })}
                  />
                  <span class="value-display">{textItem.y}px</span>
                </label>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <p>Нет добавленного текста</p>
    </div>
  {/if}
</div>

<style>
  .text-manager {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .text-manager-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }

  .add-text-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
  }

  .text-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  .text-input:focus {
    outline: none;
    border-color: #007bff;
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

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ffcdd2;
    font-size: 0.9rem;
  }

  .text-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .text-item {
    border: 2px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .text-item.selected {
    border-color: #007bff;
    background: #f0f8ff;
  }

  .text-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f9f9f9;
    cursor: pointer;
  }

  .text-content {
    font-size: 1rem;
    color: #333;
    flex: 1;
  }

  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 1.5rem;
    color: #dc3545;
    transition: all 0.2s ease;
  }

  .btn-icon:hover {
    color: #a71d2a;
  }

  .text-controls {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .control-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .control-group input[type="range"] {
    flex: 1;
    cursor: pointer;
  }

  .control-group input[type="color"] {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
  }

  .value-display {
    min-width: 40px;
    text-align: right;
    font-weight: 500;
    color: #333;
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
</style>
