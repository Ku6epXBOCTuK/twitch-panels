<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    label: string;
    children: Snippet;
    noLabel?: boolean;
  }

  let { label, children, noLabel = false }: Props = $props();

  let tag = $derived(noLabel ? "div" : "label");
</script>

<svelte:element this={tag} class="setting-row">
  <div class="setting-label">{label}</div>
  <div class="setting-control">
    {@render children()}
  </div>
</svelte:element>

<style>
  .setting-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    align-items: center;
    gap: 12px;
  }

  .setting-label {
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 500;
  }

  .setting-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }
</style>
