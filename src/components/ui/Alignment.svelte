<script lang="ts">
  import { TextAlign, type TextAlignType } from "$lib/constants";
  import TextAlignCenter from "~icons/lucide/text-align-center";
  import TextAlignEnd from "~icons/lucide/text-align-end";
  import TextAlignStart from "~icons/lucide/text-align-start";
  // import { TextAlignCenter, TextAlignEnd, TextAlignStart } from "@lucide/svelte";

  interface Props {
    align: TextAlignType;
  }

  let { align = $bindable(TextAlign.LEFT) }: Props = $props();

  function onAlignLeft() {
    align = TextAlign.LEFT;
  }
  function onAlignCenter() {
    align = TextAlign.CENTER;
  }
  function onAlignRight() {
    align = TextAlign.RIGHT;
  }
</script>

<button aria-label="Set left" class="align-btn" class:active={align === TextAlign.LEFT} onclick={onAlignLeft}>
  <TextAlignStart />
</button>
<button aria-label="Set center" class="align-btn" class:active={align === TextAlign.CENTER} onclick={onAlignCenter}>
  <TextAlignCenter />
</button>
<button aria-label="Set right" class="align-btn" class:active={align === TextAlign.RIGHT} onclick={onAlignRight}>
  <TextAlignEnd />
</button>

<style>
  .align-btn {
    flex: 1;
    padding: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }

  .align-btn :global(svg) {
    width: 16px;
    height: 16px;
    transition: var(--transition);
  }

  .align-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .align-btn.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
  }
</style>
