<script lang="ts">
  import { onMount } from "svelte";
  import { panelStore } from "../stores/panelStore";
  import { panelStorage } from "../lib/utils/panelStorage";
  import type { Panel } from "../lib/types/panel";
  import { IconButton } from "../lib/components/ui";

  interface Props {
    onPanelSelect: (panel: Panel) => void;
    onPanelDelete: (panelId: string) => void;
  }
  let { onPanelSelect, onPanelDelete }: Props = $props();

  let panels = $state<Panel[]>([]);
  let selectedPanelId = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);

  onMount(() => {
    loadPanels();
  });

  function loadPanels() {
    try {
      errorMessage = null;
      panels = panelStorage.getAllPanels();

      // Если есть текущая панель в store, отмечаем её как выбранную
      const currentPanel = $panelStore;
      if (currentPanel) {
        selectedPanelId = currentPanel.id;
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка загрузки панелей";
    }
  }

  function handlePanelSelect(panel: Panel) {
    selectedPanelId = panel.id;
    onPanelSelect(panel);
  }

  function handlePanelDelete(panelId: string) {
    try {
      errorMessage = null;
      const result = panelStorage.deletePanel(panelId);

      if (result.success) {
        panels = panels.filter((p) => p.id !== panelId);

        // Если удалили выбранную панель, сбрасываем выбор
        if (selectedPanelId === panelId) {
          selectedPanelId = null;
        }

        // Уведомляем родительский компонент
        onPanelDelete(panelId);
      } else {
        errorMessage = result.error || "Ошибка удаления панели";
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Ошибка удаления панели";
    }
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
</script>

<div class="panel-list">
  <div class="panel-list-header">
    <h2>Сохраненные панели</h2>
    <IconButton variant="secondary" onclick={loadPanels} ariaLabel="Обновить список">↻</IconButton>
  </div>

  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}

  {#if panels.length === 0}
    <div class="empty-state">
      <p>Нет сохраненных панелей</p>
    </div>
  {:else}
    <div class="panels-grid">
      {#each panels as panel (panel.id)}
        <div
          class="panel-card {selectedPanelId === panel.id ? 'selected' : ''}"
          onclick={() => handlePanelSelect(panel)}
          role="button"
          tabindex="0"
        >
          <div class="panel-preview">
            {#if panel.backgroundImage}
              <img src={panel.backgroundImage} alt="Panel preview" class="panel-image" />
            {:else}
              <div class="no-image">Нет изображения</div>
            {/if}
          </div>

          <div class="panel-info">
            <div class="panel-meta">
              <span class="panel-id">ID: {panel.id.slice(0, 8)}...</span>
              <span class="panel-date">{formatDate(panel.updatedAt)}</span>
            </div>

            <div class="panel-actions">
              <IconButton
                variant="danger"
                onclick={(e) => {
                  e.stopPropagation();
                  handlePanelDelete(panel.id);
                }}
                ariaLabel="Удалить панель"
              >
                🗑️
              </IconButton>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .panel-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .panel-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .panel-list-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ffcdd2;
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

  .panels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .panel-card {
    border: 2px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
  }

  .panel-card:hover {
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .panel-card.selected {
    border-color: #007bff;
    background: #f0f8ff;
  }

  .panel-preview {
    position: relative;
    width: 100%;
    padding-top: 31.25%; /* 320:100 aspect ratio */
    background: #f5f5f5;
  }

  .panel-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 0.9rem;
  }

  .panel-info {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .panel-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #666;
  }

  .panel-id {
    font-family: monospace;
  }

  .panel-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
</style>
