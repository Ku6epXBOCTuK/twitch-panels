<script lang="ts">
  import type { Component } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  interface Props {
    icon: Component;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    label?: string;
    type?: "primary" | "secondary" | "danger" | "outline" | "mini";
  }

  let { icon: Icon, onclick = () => {}, disabled = false, label = "", type = "primary" }: Props = $props();
</script>

<button
  class="btn"
  class:btn-primary={type === "primary"}
  class:btn-secondary={type === "secondary"}
  class:btn-outline={type === "outline"}
  class:btn-danger={type === "danger"}
  class:btn-mini={type === "mini"}
  {disabled}
  {onclick}
>
  <Icon />
  {label}
</button>

<style>
  .btn {
    padding: 10px 16px;
    border: none;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: inherit;
    white-space: nowrap;
  }

  .btn :global(svg) {
    width: 16px;
    height: 16px;
  }

  .btn:hover:not(:disabled) {
    background: var(--accent-hover);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--accent-primary);
    color: white;
  }

  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover {
    background: var(--bg-hover);
  }

  .btn-outline {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
  }

  .btn-outline:hover:not(:disabled) {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .btn-danger {
    background: var(--danger);
    color: white;
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: var(--transition);
    min-width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-danger:hover {
    background: #dc2626;
  }

  .btn-mini {
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    border-radius: var(--radius);
    color: var(--text-secondary);
    justify-content: center;
  }

  .btn-mini:hover:not(:disabled) {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
  }
</style>
