<script lang="ts">
  import type { TextAlignType } from "$lib/constants";
  import IconAlignCenter from "./Icons/IconAlignCenter.svelte";
  import IconAlignLeft from "./Icons/IconAlignLeft.svelte";
  import IconAlignRight from "./Icons/IconAlignRight.svelte";

  interface Props {
    align: TextAlignType;
  }

  let { align = $bindable("left") }: Props = $props();
</script>

<button class="align-btn" class:active={align === "left"} onclick={() => (align = "left")}>
  <IconAlignLeft />
</button>
<button class="align-btn" class:active={align === "center"} onclick={() => (align = "center")}>
  <IconAlignCenter />
</button>
<button class="align-btn" class:active={align === "right"} onclick={() => (align = "right")}>
  <IconAlignRight />
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
  }

  .align-btn :global(svg) {
    width: 16px;
    height: 16px;
    stroke: var(--text-secondary);
    transition: var(--transition);
  }

  .align-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
  }

  .align-btn:hover :global(svg) {
    stroke: var(--accent-primary);
  }

  .align-btn.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  .align-btn.active :global(svg) {
    stroke: white;
  }
</style>
