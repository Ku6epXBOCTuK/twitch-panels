<script lang="ts">
  import IconAlignCenter from "./Icons/IconAlignCenter.svelte";
  import IconAlignLeft from "./Icons/IconAlignLeft.svelte";
  import IconAlignRight from "./Icons/IconAlignRight.svelte";
</script>

<button class="align-btn active">
  <IconAlignLeft />
</button>
<button class="align-btn">
  <IconAlignCenter />
</button>
<button class="align-btn">
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
