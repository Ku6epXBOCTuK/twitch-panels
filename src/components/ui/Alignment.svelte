<script lang="ts">
  import type { TextAlignType } from "$lib/constants";
  import TextAlignCenter from "~icons/lucide/text-align-center";
  import TextAlignEnd from "~icons/lucide/text-align-end";
  import TextAlignStart from "~icons/lucide/text-align-start";
  // import { TextAlignCenter, TextAlignEnd, TextAlignStart } from "@lucide/svelte";

  interface Props {
    align: TextAlignType;
  }

  let { align = $bindable("left") }: Props = $props();
</script>

<button class="align-btn" class:active={align === "left"} onclick={() => (align = "left")}>
  <TextAlignStart />
</button>
<button class="align-btn" class:active={align === "center"} onclick={() => (align = "center")}>
  <TextAlignCenter />
</button>
<button class="align-btn" class:active={align === "right"} onclick={() => (align = "right")}>
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
