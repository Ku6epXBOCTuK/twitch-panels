<script lang="ts">
  type IconButtonVariant = "primary" | "secondary" | "danger";
  type IconButtonSize = "sm" | "md" | "lg";

  let {
    variant = "secondary",
    size = "md",
    disabled = false,
    ariaLabel = "",
    class: className = "",
    children,
    ...restProps
  }: {
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    disabled?: boolean;
    ariaLabel?: string;
    class?: string;
    children?: any;
    [key: string]: any;
  } = $props();
</script>

<button
  {disabled}
  aria-label={ariaLabel}
  class:icon-btn-primary={variant === "primary"}
  class:icon-btn-secondary={variant === "secondary"}
  class:icon-btn-danger={variant === "danger"}
  class:icon-btn-sm={size === "sm"}
  class:icon-btn-md={size === "md"}
  class:icon-btn-lg={size === "lg"}
  class={className}
  {...restProps}
>
  {@render children?.()}
</button>

<style>
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    background: none;
    padding: 0.25rem 0.5rem;
    font-size: 1.2rem;
  }

  .icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Sizes */
  .icon-btn-sm {
    padding: 0.125rem 0.25rem;
    font-size: 1rem;
  }

  .icon-btn-md {
    padding: 0.25rem 0.5rem;
    font-size: 1.2rem;
  }

  .icon-btn-lg {
    padding: 0.375rem 0.75rem;
    font-size: 1.5rem;
  }

  /* Variants */
  .icon-btn-primary {
    color: #007bff;
  }

  .icon-btn-primary:hover:not(:disabled) {
    color: #0056b3;
    transform: scale(1.1);
  }

  .icon-btn-secondary {
    color: #666;
  }

  .icon-btn-secondary:hover:not(:disabled) {
    color: #007bff;
    transform: scale(1.1);
  }

  .icon-btn-danger {
    color: #dc3545;
  }

  .icon-btn-danger:hover:not(:disabled) {
    color: #c82333;
    transform: scale(1.1);
  }
</style>
