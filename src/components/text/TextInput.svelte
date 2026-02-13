<script lang="ts">
  interface Props {
    text: string;
    ariaLabel: string;
    onenter: () => void;
  }

  let { text = $bindable(), onenter, ariaLabel }: Props = $props();

  function handleKeyboard(event: KeyboardEvent) {
    if (event.key === "Enter") {
      onenter();
    }
  }
</script>

<input
  aria-label={ariaLabel}
  bind:value={text}
  class="text-input"
  type="text"
  placeholder="Введите текст..."
  onkeydown={handleKeyboard}
/>

<style>
  .text-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--border-main);
    border-radius: var(--radius);
    font-size: 14px;
    background: var(--surface-main);
    color: var(--text-main);
    transition: var(--transition);
    font-family: inherit;
  }

  .text-input:focus {
    outline: none;
    border-color: var(--border-strong);
  }

  .text-input::placeholder {
    color: var(--text-muted);
  }
</style>
