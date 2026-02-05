<script lang="ts">
  import Badge from "$components/ui/Badge.svelte";
  import Button from "$components/ui/Button.svelte";
  import IconArrowLeft from "$components/ui/Icons/IconArrowLeft.svelte";
  import IconArrowRight from "$components/ui/Icons/IconArrowRight.svelte";
  import IconUpload from "$components/ui/Icons/IconUpload.svelte";
  import Card from "./Card.svelte";
</script>

<div class="panel-bar">
  <Card title="Фоновое изображение">
    <Button label="Загрузить изображение" icon={IconUpload} onclick={() => {}} type="secondary" />
  </Card>

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
</div>

<style>
</style>
