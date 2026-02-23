<script lang="ts">
  import type { Component } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  interface Props {
    icon: Component;
    ariaLabel: string;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    label?: string;
    variant?: "primary" | "secondary" | "danger" | "outline";
    size?: "default" | "mini";
  }

  let {
    icon: Icon,
    ariaLabel,
    onclick = () => {},
    disabled = false,
    label = "",
    variant = "primary",
    size = "default",
  }: Props = $props();
</script>

<button
  class="btn"
  class:btn-primary={variant === "primary"}
  class:btn-secondary={variant === "secondary"}
  class:btn-outline={variant === "outline"}
  class:btn-danger={variant === "danger"}
  class:btn-mini={size === "mini"}
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
    border: 1px solid var(--btn-main);
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

  .btn-danger {
    --btn-main: var(--danger-base);
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

  .btn-mini {
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: var(--radius);
    justify-content: center;
  }
</style>
