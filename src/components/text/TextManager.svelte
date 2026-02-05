<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import InputGroup from "$components/layout/InputGroup.svelte";
  import Button from "$components/ui/Button.svelte";
  import IconPlus from "$components/ui/Icons/IconPlus.svelte";
  import { textsState } from "$states/texts.state.svelte";
  import TextInlineEdit from "./TextInlineEdit.svelte";
  import TextInput from "./TextInput.svelte";

  let text: string = $state("");

  function addText() {
    console.log(text);
    text = "";
  }

  function deleteText(id: number) {}
</script>

<Card title="Тексты панелей">
  <InputGroup>
    <TextInput bind:text onenter={addText} />
    <Button icon={IconPlus} onclick={addText} />
  </InputGroup>
  <div class="texts-list">
    {#each textsState.texts as { text, id } (id)}
      <TextInlineEdit {text} ondelete={() => deleteText(id)} />
    {/each}
  </div>
</Card>

<style>
  /* Texts List */
  .texts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
