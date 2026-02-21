<script lang="ts">
  import PanelBar from "$components/layout/PanelBar.svelte";
  import TextBar from "$components/layout/TextBar.svelte";
</script>

<div class="main-grid">
  <TextBar />
  <PanelBar />
</div>

<style>
  .main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 1024px) {
    .main-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
