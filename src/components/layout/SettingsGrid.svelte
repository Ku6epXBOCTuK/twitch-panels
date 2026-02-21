<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import type { Component, Snippet } from "svelte";

  interface Props {
    children: Snippet;
    label: string;
    icon: Component;
  }

  let { children, label = "fuf", icon }: Props = $props();

  let expanded = $state(false);
</script>

<div class="settings-grid">
  <label>
    {label}
    <Button {icon} ariaLabel="Expand" type="mini" onclick={() => (expanded = !expanded)} />
  </label>
  {#if expanded}
    {@render children()}
  {/if}
</div>

<style>
  .settings-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    background: var(--surface-subtle);
    border-radius: var(--radius);
    border: 1px solid var(--border-main);
  }

  label {
    color: var(--text-main);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
</style>
