<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import { TRANSITION_DURATION } from "$lib/constants";
  import { fly, slide } from "svelte/transition";
  import Cross from "~icons/lucide/x";

  interface Props {
    text: string;
    id: number;
    ondelete: (id: number) => void;
  }

  let { text = $bindable(), id, ondelete }: Props = $props();
</script>

<li
  in:slide={{ duration: TRANSITION_DURATION / 2 }}
  out:slide={{ duration: TRANSITION_DURATION / 2, delay: TRANSITION_DURATION }}
>
  <div
    class="text-item"
    in:fly={{ x: 600, duration: TRANSITION_DURATION, delay: TRANSITION_DURATION }}
    out:fly={{ x: 600, duration: TRANSITION_DURATION }}
  >
    <input type="text" bind:value={text} />
    <Button icon={Cross} ariaLabel="Delete" type="danger" onclick={() => ondelete(id)} />
  </div>
</li>

<style>
  .text-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--surface-subtle);
    border: 1px solid var(--border-main);
    border-radius: var(--radius);
    transition: var(--transition);
  }

  .text-item:hover {
    border-color: var(--border-strong);
  }

  .text-item input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid var(--border-main);
    border-radius: 4px;
    font-size: 14px;
    background: var(--surface-main);
    color: var(--text-main);
    transition: var(--transition);
    font-family: inherit;
  }

  .text-item input:focus {
    outline: none;
    border-color: var(--border-strong);
  }
</style>
