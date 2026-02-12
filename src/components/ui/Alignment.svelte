<script lang="ts">
  import { TextAlign, type TextAlignType } from "$lib/constants";
  import TextAlignCenter from "~icons/lucide/text-align-center";
  import TextAlignEnd from "~icons/lucide/text-align-end";
  import TextAlignStart from "~icons/lucide/text-align-start";

  interface Props {
    align: TextAlignType;
  }

  let { align = $bindable(TextAlign.LEFT) }: Props = $props();
</script>

<div class="alignment-group">
  <label class="alignment-item">
    <input
      type="radio"
      name="alignment"
      value={TextAlign.LEFT}
      class="sr-only"
      bind:group={align}
      aria-label={`Set ${TextAlign.LEFT}`}
    />
    <div class="alignment-button"><TextAlignStart /></div>
  </label>

  <label class="alignment-item">
    <input
      type="radio"
      name="alignment"
      value={TextAlign.CENTER}
      class="sr-only"
      bind:group={align}
      aria-label={`Set ${TextAlign.CENTER}`}
    />
    <div class="alignment-button"><TextAlignCenter /></div>
  </label>

  <label class="alignment-item">
    <input
      type="radio"
      name="alignment"
      value={TextAlign.RIGHT}
      class="sr-only"
      bind:group={align}
      aria-label={`Set ${TextAlign.RIGHT}`}
    />
    <div class="alignment-button"><TextAlignEnd /></div>
  </label>
</div>

<style>
  .alignment-group {
    display: flex;
    overflow: hidden;
    width: 100%;
  }

  .alignment-button {
    flex-grow: 1;
    border: 1px solid var(--border-strong);
    padding: 6px 12px;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.2s ease;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .alignment-button:hover {
    color: var(--text-main);
    background: var(--surface-subtle);
  }

  .alignment-item {
    flex-grow: 1;
    & input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    &:first-child .alignment-button {
      border-top-left-radius: var(--radius);
      border-bottom-left-radius: var(--radius);
    }
    &:last-child .alignment-button {
      border-top-right-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }
  }

  .alignment-item input:checked + .alignment-button {
    background: var(--action-primary);
    color: var(--text-action);
  }
</style>
