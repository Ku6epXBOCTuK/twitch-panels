<script lang="ts">
  import type { ChangeEventHandler } from "svelte/elements";

  interface Props {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onchange?: ChangeEventHandler<HTMLInputElement>;
  }

  let { value = $bindable(), min = 0, max = 100, step = 1, onchange = () => {} }: Props = $props();
</script>

<input type="range" {min} {max} {step} bind:value class="slider" {onchange} />
<span class="value-display">{value}</span>

<style>
  .slider {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: var(--surface-control);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--action-primary);
    cursor: pointer;
    transition: var(--transition);
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  .slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--action-primary);
    cursor: pointer;
    border: none;
    transition: var(--transition);
  }

  .slider::-moz-range-thumb:hover {
    transform: scale(1.1);
  }

  .value-display {
    color: var(--text-main);
    font-weight: 500;
    min-width: 40px;
    text-align: right;
    font-size: 13px;
    padding: 4px 8px;
    background: var(--surface-main);
    border-radius: 4px;
  }
</style>
