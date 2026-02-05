<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string | Snippet;
    children: Snippet;
    titleSnippet?: Snippet;
  }

  let { title, children, titleSnippet = emptySnippet }: Props = $props();
</script>

<!-- svelte-ignore block_empty -->
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
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
    transition: var(--transition);
  }

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
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
</style>
