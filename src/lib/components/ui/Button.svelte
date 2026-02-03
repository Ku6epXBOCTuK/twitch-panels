<script lang="ts">
  type ButtonVariant = "primary" | "secondary" | "danger";
  type ButtonSize = "sm" | "md" | "lg";
  type ButtonType = "button" | "submit" | "reset";

  let {
    variant = "primary",
    size = "md",
    disabled = false,
    type = "button",
    fullWidth = false,
    loading = false,
    class: className = "",
    children,
    ...restProps
  }: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    type?: ButtonType;
    fullWidth?: boolean;
    loading?: boolean;
    class?: string;
    children?: any;
    [key: string]: any;
  } = $props();
</script>

<button
  {type}
  {disabled}
  class:btn-primary={variant === "primary"}
  class:btn-secondary={variant === "secondary"}
  class:btn-danger={variant === "danger"}
  class:btn-sm={size === "sm"}
  class:btn-md={size === "md"}
  class:btn-lg={size === "lg"}
  class:btn-full={fullWidth}
  class:btn-loading={loading}
  class={className}
  {...restProps}
>
  {#if loading}
    <span class="btn-spinner"></span>
  {/if}
  {@render children?.()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Sizes */
  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .btn-md {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .btn-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  .btn-full {
    width: 100%;
  }

  /* Variants */
  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #545b62;
  }

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #c82333;
  }

  /* Loading state */
  .btn-loading {
    position: relative;
    pointer-events: none;
  }

  .btn-spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
