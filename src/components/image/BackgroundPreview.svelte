<script lang="ts">
  import { Button } from "$lib/components/ui";

  interface Props {
    backgroundImage?: string | undefined;
    onUploadNewImage: () => void;
  }

  let { backgroundImage, onUploadNewImage }: Props = $props();
</script>

{#if backgroundImage}
  <div class="background-preview">
    <div class="background-header">
      <h3>Фоновое изображение</h3>
      <Button variant="secondary" size="sm" onclick={onUploadNewImage}>Загрузить</Button>
    </div>
    <img src={backgroundImage} alt="Фон" />
  </div>
{/if}

<style>
  .background-preview {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .background-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .background-preview h3 {
    margin: 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
  }

  .background-preview img {
    width: 100%;
    max-width: 320px;
    height: auto;
    border-radius: 4px;
  }
</style>
