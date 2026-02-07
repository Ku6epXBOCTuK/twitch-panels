<script lang="ts">
  import { konvaAllStagesState } from "$states/konvaAllStages.svelte";
  import { textsState } from "$states/texts.svelte";

  import Preview from "./Preview.svelte";
</script>

<div class="outside-display">
  {#each textsState.texts as { text, id }, idx (id)}
    <Preview {text} bind:stage={konvaAllStagesState[idx]} />
  {:else}
    <p>No texts to preview</p>
  {/each}
</div>

<style>
  .outside-display {
    position: fixed;
    top: -1000px;
    left: -1000px;
  }
</style>
