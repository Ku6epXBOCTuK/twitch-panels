<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import InputGroup from "$components/layout/InputGroup.svelte";
  import Button from "$components/ui/Button.svelte";
  import { textsState } from "$states/texts.svelte";
  import { Plus } from "@lucide/svelte";
  import TextInlineEdit from "./TextInlineEdit.svelte";
  import TextInput from "./TextInput.svelte";

  let text: string = $state("");

  function addText() {
    let trimmed = text.trim();
    if (trimmed.length !== 0) {
      textsState.addText(trimmed);
    }
    text = "";
  }

  function deleteText(id: number) {
    textsState.removeText(id);
  }
</script>

<Card title="Тексты панелей">
  <InputGroup>
    <TextInput bind:text onenter={addText} />
    <Button icon={Plus} onclick={addText} />
  </InputGroup>
  <div class="texts-list">
    {#each textsState.texts as { text, id } (id)}
      <TextInlineEdit {id} {text} ondelete={() => deleteText(id)} />
    {/each}
  </div>
</Card>

<style>
  .texts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
