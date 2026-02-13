<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="settings-grid">
  {@render children()}
</div>

<style>
  .settings-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
