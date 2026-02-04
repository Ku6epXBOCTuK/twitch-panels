<script lang="ts">
  import { Button } from "$lib/components/ui";

  interface Props {
    onTextAdd: (text: string) => void;
    onTextUpdate: (id: string, text: string) => void;
    onTextDelete: (id: string) => void;
    texts: Array<{ id: string; text: string }>;
  }

  let { onTextAdd, onTextUpdate, onTextDelete, texts }: Props = $props();

  let newText = $state("");
  let errorMessage = $state<string | undefined>(undefined);

  // Общие настройки текста для всех панелей
  let commonTextSettings = $state({
    fontSize: 18,
    fontFamily: "Arial",
    color: "#ffffff",
    textAlign: "left",
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

  function handleAddText() {
    if (!newText.trim()) {
      errorMessage = "Введите текст";
      return;
    }

    if (newText.length > 100) {
      errorMessage = "Текст не должен превышать 100 символов";
      return;
    }

    try {
      errorMessage = undefined;
      onTextAdd(newText.trim());
      newText = "";
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка добавления текста";
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      handleAddText();
    }
  }

  function handleUpdateText(id: string, newText: string) {
    if (onTextUpdate && newText.trim()) {
      onTextUpdate(id, newText.trim());
    }
  }

  function handleDeleteText(id: string) {
    if (onTextDelete) {
      onTextDelete(id);
    }
  }
</script>

<div class="text-manager">
  <div class="add-text-section">
    <div class="input-group">
      <input
        type="text"
        bind:value={newText}
        placeholder="Введите текст для панели (например: links, about me, projects...)"
        class="text-input"
        maxlength="100"
        onkeypress={handleKeyPress}
      />
      <Button variant="primary" onclick={handleAddText}>Добавить</Button>
    </div>
    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}
  </div>

  <!-- Список текстов -->
  {#if texts.length > 0}
    <div class="texts-list">
      <h3>Созданные тексты ({texts.length})</h3>
      <div class="texts-container">
        {#each texts as textItem (textItem.id)}
          <div class="text-item">
            <input
              type="text"
              value={textItem.text}
              oninput={(e) => handleUpdateText(textItem.id, e.currentTarget.value)}
              class="text-edit-input"
              maxlength="100"
            />
            <Button variant="danger" size="sm" onclick={() => handleDeleteText(textItem.id)} aria-label="Удалить текст">
              ×
            </Button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Общие настройки текста -->
  <div class="common-settings-section">
    <h3>Общие настройки текста</h3>
    <p class="settings-note">Настройки применятся ко всем создаваемым панелям</p>

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
            oninput={(e: Event) => {
              commonTextSettings.fontSize = parseInt((e.target as HTMLInputElement).value);
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
              commonTextSettings.fontFamily = (e.target as HTMLSelectElement).value;
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
              commonTextSettings.color = (e.target as HTMLInputElement).value;
            }}
          />
        </label>
      </div>

      <div class="control-group">
        <label>
          Выравнивание:
          <div class="alignment-buttons">
            <button
              class="align-btn {commonTextSettings.textAlign === 'left' ? 'active' : ''}"
              onclick={() => {
                commonTextSettings.textAlign = "left";
              }}
              aria-label="Выровнять по левому краю"
            >
              ←
            </button>
            <button
              class="align-btn {commonTextSettings.textAlign === 'center' ? 'active' : ''}"
              onclick={() => {
                commonTextSettings.textAlign = "center";
              }}
              aria-label="Выровнять по центру"
            >
              ↔
            </button>
            <button
              class="align-btn {commonTextSettings.textAlign === 'right' ? 'active' : ''}"
              onclick={() => {
                commonTextSettings.textAlign = "right";
              }}
              aria-label="Выровнять по правому краю"
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
              commonTextSettings.paddingX = parseInt((e.target as HTMLInputElement).value);
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
              commonTextSettings.verticalOffset = parseInt((e.target as HTMLInputElement).value);
            }}
          />
          <span class="value-display"
            >{commonTextSettings.verticalOffset > 0 ? "+" : ""}{commonTextSettings.verticalOffset}px</span
          >
        </label>
      </div>
    </div>
  </div>
</div>

<style>
  .text-manager {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
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

  .settings-note {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.875rem;
    font-style: italic;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .alignment-buttons {
    display: flex;
    gap: 0.25rem;
  }

  .align-btn {
    padding: 0.5rem 0.75rem;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
  }

  .align-btn:hover {
    background: #f0f0f0;
    border-color: #007bff;
  }

  .align-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .add-text-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .texts-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .texts-list h3 {
    margin: 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
  }

  .texts-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .text-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .text-edit-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
  }

  .text-edit-input:focus {
    outline: none;
    border-color: #007bff;
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
