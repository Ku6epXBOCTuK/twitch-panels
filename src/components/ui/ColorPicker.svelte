<script lang="ts">
  import type { HexColor } from "$lib/types";

  interface Props {
    value: HexColor;
  }

  let { value = $bindable() }: Props = $props();
</script>

<input type="color" role="button" bind:value class="color-input" />
<span class="color-value">{value}</span>

<style>
  .color-input {
    width: 40px;
    height: 32px;
    border: 1px solid var(--border-main);
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
    background: var(--surface-main);
    padding: 0px 8px;
    flex: 1;
  }

  .color-input:hover {
    border-color: var(--action-primary);
  }

  .color-value {
    font-family: "Courier New", monospace;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    padding: 4px 8px;
    background: var(--surface-main);
    border-radius: 4px;
  }
</style>
