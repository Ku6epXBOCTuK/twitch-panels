<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import Badge from "$components/ui/Badge.svelte";
  import Button from "$components/ui/Button.svelte";
  import { PANEL_SETTINGS, TRANSITION_DURATION, type SlideDirectionType } from "$lib/constants";
  import { downloadService, type DownloadItem } from "$services/downloadService";
  import { konvaAllStagesState } from "$states/konvaAllStages.svelte";
  import { konvaStageState } from "$states/konvaStage.svelte";
  import { textsState } from "$states/texts.svelte";
  import { fly } from "svelte/transition";
  import Download from "~icons/lucide/download";
  import StickyNote from "~icons/lucide/sticky-note";
  import Preview from "./Preview.svelte";
  import PreviewAll from "./PreviewAll.svelte";
  import PreviewControls from "./PreviewControls.svelte";

  let current: number = $state(0);
  let direction: SlideDirectionType = $state("next");

  let xDirection = $derived(direction == "next" ? PANEL_SETTINGS.PANEL_WIDTH : -PANEL_SETTINGS.PANEL_WIDTH);

  $effect(() => {
    if (textsState.texts.length === 0) {
      current = 0;
    } else {
      if (current > textsState.texts.length - 1) {
        current = textsState.texts.length - 1;
      }
    }
  });

  function downloadAll() {
    let downloadItems: Array<DownloadItem> = textsState.texts.map((text, idx) => ({
      filename: text.text,
      stage: konvaAllStagesState[idx]?.node,
    }));

    downloadService.downloadAll(downloadItems);
  }

  function downloadCurrent() {
    let node = konvaStageState.stage?.node;
    if (node) {
      downloadService.downloadPanel(node, textsState.texts[current].text);
    }
  }
</script>

{#snippet panelTitle()}
  Панели <Badge text={textsState.texts.length} />
{/snippet}

{#snippet panelControls()}
  <PreviewControls bind:current bind:direction max={textsState.texts.length} />
{/snippet}

<Card title={panelTitle} titleSnippet={panelControls}>
  <div class="panel-viewer">
    <div class="panel-display">
      {#if textsState.texts.length}
        {#key current}
          {@const text = textsState?.texts[current]?.text}
          <div
            class="konva-wrapper"
            in:fly={{ x: xDirection, duration: TRANSITION_DURATION }}
            out:fly={{ x: -xDirection, duration: TRANSITION_DURATION }}
          >
            <Preview {text} bind:stage={konvaStageState.stage} />
          </div>
        {/key}
      {:else}
        <div class="empty-state">
          <StickyNote />
          <p>Добавьте тексты для создания панелей</p>
        </div>
      {/if}
    </div>

    <div class="panel-actions">
      <Button label="Скачать всё" ariaLabel="Download all" icon={Download} onclick={downloadAll} />
      <Button label="Скачать" ariaLabel="Download current" type="outline" icon={Download} onclick={downloadCurrent} />
    </div>
  </div>
</Card>
<PreviewAll />

<style>
  .panel-viewer {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .panel-display {
    background: var(--bg-secondary);
    border-radius: var(--radius);
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    position: relative;
  }

  .panel-actions {
    display: flex;
    gap: 8px;
  }

  .empty-state {
    text-align: center;
    padding: 32px 16px;
    color: var(--text-tertiary);
  }

  .empty-state :global(svg) {
    width: 48px;
    height: 48px;
    margin: 0 auto 12px;
    opacity: 0.5;
  }

  .empty-state p {
    font-size: 14px;
  }

  .konva-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
