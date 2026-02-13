<script lang="ts">
  import type { Component } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  interface Props {
    icon: Component;
    ariaLabel: string;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    label?: string;
    type?: "primary" | "secondary" | "danger" | "outline" | "mini";
    extra?: "grow";
  }

  let {
    icon: Icon,
    ariaLabel,
    onclick = () => {},
    disabled = false,
    label = "",
    type = "primary",
    extra,
  }: Props = $props();
</script>

<button
  class="btn"
  class:btn-primary={type === "primary"}
  class:btn-secondary={type === "secondary"}
  class:btn-outline={type === "outline"}
  class:btn-danger={type === "danger"}
  class:btn-mini={type === "mini"}
  class:grow={extra === "grow"}
  {disabled}
  {onclick}
  aria-label={ariaLabel}
>
  <Icon />
  {label}
</button>

<style>
  .btn {
    --btn-main: var(--action-primary);
    --btn-hover: var(--action-primary-hover);
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
    background-color: var(--btn-main);
    color: var(--text-action);
  }

  .btn :global(svg) {
    width: 16px;
    height: 16px;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn:hover:not(:disabled) {
    background-color: var(--btn-hover);
    box-shadow: var(--shadow-md);
  }

  .btn-secondary {
    --btn-main: var(--action-secondary);
    --btn-hover: var(--action-secondary-hover);
  }

  .btn-outline {
    background: transparent;
    color: var(--text-main);
    border: 1px solid var(--border-strong);
  }

  .btn-outline:hover:not(:disabled) {
    background: var(--surface-hover);
    border-color: var(--border-strong);
    color: var(--text-main);
  }

  .btn-danger {
    --btn-main: var(--danger-base);
  }

  .btn-mini {
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--border-main);
    border-radius: var(--radius);
    justify-content: center;
  }

  .btn-mini:hover:not(:disabled) {
    border-color: var(--border-main);
  }

  .grow {
    flex-grow: 1;
    justify-content: center;
  }
</style>
