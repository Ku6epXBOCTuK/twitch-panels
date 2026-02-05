<script lang="ts">
  import IconArrowLeft from "$components/ui/Icons/IconArrowLeft.svelte";
  import IconArrowRight from "$components/ui/Icons/IconArrowRight.svelte";
  import Card from "./Card.svelte";
</script>

<div class="panel-bar">
  <Card title="Фоновое изображение">фоновое изображение</Card>

  {#snippet panelTitle()}
    Панели <span class="badge" id="panelCount">0</span>
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
</div>

<style>
</style>
