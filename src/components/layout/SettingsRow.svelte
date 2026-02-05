<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    label: string;
    children: Snippet;
  }

  let { label, children }: Props = $props();
</script>

<label class="setting-row">
  <div class="setting-label">{label}</div>
  <div class="setting-control">
    {@render children()}
  </div>
</label>

<style>
  .setting-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    align-items: center;
    gap: 12px;
  }

  .setting-label {
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 500;
  }

  .setting-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }
</style>
