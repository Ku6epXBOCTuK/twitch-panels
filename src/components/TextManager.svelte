
<script lang="ts">
  import { panelStore, addTextToPanel, updateTextInPanel, removeTextFromPanel } from "../stores/panelStore";
  import type { TextItem } from "../lib/types/panel";
  import { v4 as uuidv4 } from "uuid";

  let { onTextUpdate }: {
    onTextUpdate: (texts: TextItem[]) => void;
  } = $props();

  let currentPanel = $state($panelStore);
  let newText = $state("");
  let errorMessage = $state<string | null>(null);

  // Общие настройки текста для всех текстов
  let commonTextSettings = $state({
    fontSize: 18,
    fontFamily: "Arial",
    color: "#ffffff",
    textAlign: "center" as "left" | "center" | "right",
    paddingX: 10,
    verticalOffset: 0,
  });

  // Список доступных шрифтов
  const availableFonts = [
    "Arial",
    "Verdana",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Impact",
    "Comic Sans MS",
    "Trebuchet MS",
  ];

  // Применить общие настройки ко всем текстам
  function applyCommonSettingsToAll() {
    if (!currentPanel) return;

    const updatedTexts = currentPanel.texts.map(text => ({
      ...text,
      fontSize: commonTextSettings.fontSize,
      fontFamily: commonTextSettings.fontFamily,
      color: commonTextSettings.color,
      textAlign: commonTextSettings.textAlign,
      paddingX: commonTextSettings.paddingX,
      verticalOffset: commonTextSettings.verticalOffset,
    }));

    const updatedPanel = updatePanel(currentPanel, { texts: updatedTexts });
    panelStore.set(updatedPanel);
    onTextUpdate(updatedTexts);
  }

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
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка удаления текста";
    }
  }
</script>

<div class="text-manager">
  <div class="text-manager-header">
    <h2>Управление текстом</h2>
  </div>

  <!-- Общие настройки текста -->
  <div class="common-settings-section">
    <h3>Общие настройки текста</h3>
    
    <div class="settings-grid">
      <div class="control-group">
        <label>
          Размер шрифта:
          <input
            type="range"
            min="10"
            max="72"
            step="1"
            value={commonTextSettings.fontSize}
            oninput={(e) => {
              commonTextSettings.fontSize = parseInt(e.target.value);
              applyCommonSettingsToAll();
            }}
          />
          <span class="value-display">{commonTextSettings.fontSize}px</span>
        </label>
      </div>

      <div class="control-group">
        <label>
          Шрифт:
          <select
            value={commonTextSettings.fontFamily}
            onchange={(e) => {
              commonTextSettings.fontFamily = e.target.value;
              applyCommonSettingsToAll();
            }}
          >
            {#each availableFonts as font}
              <option value={font}>{font}</option>
            {/each}
          </select>
        </label>
      </div>

      <div class="control-group">
        <label>
          Цвет:
          <input
            type="color"
            value={commonTextSettings.color}
            oninput={(e) => {
              commonTextSettings.color = e.target.value;
              applyCommonSettingsToAll();
            }}
          />
        </label>
      </div>

      <div class="control-group">
        <label>
          Выравнивание:
          <div class="alignment-buttons">
            <button
              class="btn-align {commonTextSettings.textAlign === 'left' ? 'active' : ''}"
              onclick={() => {
                commonTextSettings.textAlign = 'left';
                applyCommonSettingsToAll();
              }}
            >
              ←
            </button>
            <button
              class="btn-align {commonTextSettings.textAlign === 'center' ? 'active' : ''}"
              onclick={() => {
                commonTextSettings.textAlign = 'center';
                applyCommonSettingsToAll();
              }}
            >
              ↔
            </button>
            <button
              class="btn-align {commonTextSettings.textAlign === 'right' ? 'active' : ''}"
              onclick={() => {
                commonTextSettings.textAlign = 'right';
                applyCommonSettingsToAll();
              }}
            >
              →
            </button>
          </div>
        </label>
      </div>

      <div class="control-group">
        <label>
          Боковые отступы:
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={commonTextSettings.paddingX}
            oninput={(e) => {
              commonTextSettings.paddingX = parseInt(e.target.value);
              applyCommonSettingsToAll();
            }}
          />
          <span class="value-display">{commonTextSettings.paddingX}px</span>
        </label>
      </div>

      <div class="control-group">
        <label>
          Смещение от центра:
          <input
            type="range"
            min="-50"
            max="50"
            step="1"
            value={commonTextSettings.verticalOffset}
            oninput={(e) => {
              commonTextSettings.verticalOffset = parseInt(e.target.value);
              applyCommonSettingsToAll();
            }}
          />
          <span class="value-display">{commonTextSettings.verticalOffset > 0 ? '+' : ''}{commonTextSettings.verticalOffset}px</span>
        </label>
      </div>
    </div>
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
      <button class="btn btn-primary" onclick={handleAddText}>
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
        <div class="text-item">
          <span class="text-content">{textItem.text}</span>
          <button
            class="btn-icon btn-delete"
            onclick={() => handleRemoveText(textItem.id)}
            aria-label="Удалить текст"
          >
            ×
          </button>
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
    gap: 1rem;
    width: 100%;
  }

  .text-manager-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.25rem;
  }

  .common-settings-section {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .common-settings-section h3 {
    margin: 0 0 0.75rem 0;
    color: #333;
    font-size: 1rem;
    font-weight: 500;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .alignment-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .btn-align {
    flex: 1;
    padding: 0.5rem;
    border: 2px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }

  .btn-align:hover {
    border-color: #007bff;
    background: #f0f8ff;
  }

  .btn-align.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
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
    padding: 0.6rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
  }

  .text-input:focus {
    outline: none;
    border-color: #007bff;
  }

  .btn {
    padding: 0.6rem 1.25rem;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
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
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #ffcdd2;
    font-size: 0.9rem;
  }

  .text-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .text-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    background: white;
    transition: all 0.2s ease;
  }

  .text-item:hover {
    border-color: #007bff;
    background: #f0f8ff;
  }

  .text-content {
    font-size: 0.95rem;
    color: #333;
    flex: 1;
  }

  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 1.25rem;
    color: #dc3545;
    transition: all 0.2s ease;
    line-height: 1;
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
