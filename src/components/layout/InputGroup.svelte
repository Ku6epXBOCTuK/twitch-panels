<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="input-group">
  {@render children()}
</div>

<style>
  .input-group {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
</style>
