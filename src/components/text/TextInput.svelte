<script lang="ts">
  interface Props {
    text: string;
    onenter: () => void;
  }

  let { text = $bindable(), onenter }: Props = $props();

  function handleKeyboard(event: KeyboardEvent) {
    if (event.key === "Enter") {
      onenter();
    }
  }
</script>

<input bind:value={text} class="text-input" type="text" placeholder="Введите текст..." onkeydown={handleKeyboard} />

<style>
  .text-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: 14px;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: var(--transition);
    font-family: inherit;
  }

  .text-input:focus {
    outline: none;
    border-color: var(--accent-primary);
  }

  .text-input::placeholder {
    color: var(--text-tertiary);
  }
</style>
