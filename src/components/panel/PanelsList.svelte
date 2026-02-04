<script lang="ts">
  import type { Panel } from "$lib/types/panel";
  import type { Stage as KonvaStage } from "konva/lib/Stage";
  import Button from "../ui/Button.svelte";
  import PanelPreview from "./PanelPreview.svelte";

  interface Props {
    panels: Panel[];
    onDownload: (panel: Panel, konvaStage: KonvaStage) => void;
    onDownloadAll: () => void;
  }
  let { panels, onDownload, onDownloadAll }: Props = $props();
</script>

{#if panels.length > 0}
  <div class="panels-container">
    <div class="panels-header">
      <h2>Созданные панели ({panels.length})</h2>
      <Button variant="primary" onclick={onDownloadAll}>Скачать все</Button>
    </div>
    <div class="panels-list">
      {#each panels as panel (panel.id)}
        <div class="panel-item">
          <PanelPreview {panel} onDownload={(panel, konvaStage) => onDownload(panel, konvaStage)} />
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .panels-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .panels-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
  }

  .panels-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .panels-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .panel-item {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
    background: white;
  }
</style>
