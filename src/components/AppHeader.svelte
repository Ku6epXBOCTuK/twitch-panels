<script lang="ts">
  import { Button } from "../lib/components/ui";

  let {
    onUploadNewImage
  }: {
    onUploadNewImage?: () => void;
  } = $props();
</script>

<div class="app-header">
  <h1>Twitch Panels Creator</h1>
  {#if onUploadNewImage}
    <Button variant="primary" onclick={onUploadNewImage}>Загрузить изображение</Button>
  {/if}
</div>

<style>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .app-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }
</style>
