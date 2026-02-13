<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string | Snippet;
    children: Snippet;
    titleSnippet?: Snippet;
  }

  let { title, children, titleSnippet = emptySnippet }: Props = $props();
</script>

{#snippet emptySnippet()}{/snippet}

<section class="card">
  <div class="card-header-row">
    <h2 class="card-title">
      {#if typeof title === "string"}
        {title}
      {:else}
        {@render title()}
      {/if}
    </h2>
    <div class="card-snippet">
      {@render titleSnippet()}
    </div>
  </div>
  <div class="card-body">
    {@render children()}
  </div>
</section>

<style>
  .card {
    background: var(--surface-elevated);
    border: 1px solid var(--border-main);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
    transition: var(--transition);
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .card-snippet {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
