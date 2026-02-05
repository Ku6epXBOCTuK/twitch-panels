<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import IconCross from "$components/ui/Icons/IconCross.svelte";

  interface Props {
    text: string;
    ondelete: () => void;
  }

  let { text = $bindable(), ondelete }: Props = $props();
</script>

<div class="text-item">
  <input type="text" bind:value={text} />
  <Button icon={IconCross} type="danger" on:click={ondelete} />
</div>

<style>
  .text-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    transition: var(--transition);
  }

  .text-item:hover {
    border-color: var(--border-hover);
  }

  .text-item input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 14px;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: var(--transition);
    font-family: inherit;
  }

  .text-item input:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
</style>
