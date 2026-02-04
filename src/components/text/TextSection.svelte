<script lang="ts">
  import type { TextItem } from "$lib/types/panel";
  import TextManager from "./TextManager.svelte";

  interface Props {
    texts: Array<{ id: string; text: string }>;
    onTextAdd: (text: string, settings?: Partial<TextItem>) => void;
    onTextUpdate: (id: string, text: string) => void;
    onTextDelete: (id: string) => void;
  }

  let { texts, onTextAdd, onTextUpdate, onTextDelete }: Props = $props();
</script>

<div class="text-section">
  <h2>Добавьте тексты для панелей</h2>
  <TextManager {onTextAdd} {onTextUpdate} {onTextDelete} {texts} />
</div>

<style>
  .text-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .text-section h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
  }
</style>
