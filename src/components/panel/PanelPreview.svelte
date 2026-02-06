<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import Badge from "$components/ui/Badge.svelte";
  import IconArrowLeft from "$components/ui/Icons/IconArrowLeft.svelte";
  import IconArrowRight from "$components/ui/Icons/IconArrowRight.svelte";
</script>

{#snippet panelTitle()}
  Панели <Badge text="0" />
{/snippet}

{#snippet panelControls()}
  <button id="prevPanel" class="nav-btn" disabled>
    <IconArrowLeft />
  </button>
  <span id="panelIndicator" class="panel-indicator">0 / 0</span>
  <button id="nextPanel" class="nav-btn" disabled>
    <IconArrowRight />
  </button>
{/snippet}

<Card title={panelTitle} titleSnippet={panelControls}>Панели</Card>

<style>
</style>
