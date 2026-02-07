<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import Badge from "$components/ui/Badge.svelte";
  import Button from "$components/ui/Button.svelte";
  import IconDownload from "$components/ui/Icons/IconDownload.svelte";
  import IconEmpty from "$components/ui/Icons/IconEmpty.svelte";
  import type { SlideDirectionType } from "$lib/constants";
  import { textsState } from "$states/texts.svelte";
  import Preview from "./Preview.svelte";
  import PreviewControls from "./PreviewControls.svelte";

  let current: number = $state(0);
  let direction: SlideDirectionType = $state("next");

  $effect(() => {
    $inspect(current, textsState.texts);
    if (textsState.texts.length === 0) {
      current = 0;
    } else {
      if (current > textsState.texts.length - 1) {
        current = textsState.texts.length - 1;
      }
    }
  });
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
          <Preview {text} {direction} />
        {/key}
      {:else}
        <div class="empty-state">
          <IconEmpty />
          <p>Добавьте тексты для создания панелей</p>
        </div>
      {/if}
    </div>

    <div class="panel-actions">
      <Button label="Скачать всё" icon={IconDownload} />
      <Button label="Скачать" type="outline" icon={IconDownload} />
    </div>
  </div>
</Card>

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
</style>
