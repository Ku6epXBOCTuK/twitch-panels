<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import InputGroup from "$components/layout/InputGroup.svelte";
  import Button from "$components/ui/Button.svelte";
  import { textsState } from "$states/texts.svelte";
  import Plus from "~icons/lucide/plus";
  import TextInlineEdit from "./TextInlineEdit.svelte";
  import TextInput from "./TextInput.svelte";

  let text: string = $state("");

  function addText() {
    textsState.addText(text);
    text = "";
  }

  function deleteText(id: number) {
    textsState.removeText(id);
  }
</script>

<Card title="Тексты панелей">
  <InputGroup>
    <TextInput ariaLabel="Input new text" bind:text onenter={addText} />
    <Button icon={Plus} ariaLabel="Add text" onclick={addText} />
  </InputGroup>
  <ul class="texts-list">
    {#each textsState.texts as { id }, idx (id)}
      <TextInlineEdit {id} bind:text={textsState.texts[idx].text} ondelete={() => deleteText(id)} />
    {/each}
  </ul>
</Card>

<style>
  .texts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
