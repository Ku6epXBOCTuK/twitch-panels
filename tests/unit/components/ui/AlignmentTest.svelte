<script lang="ts">
  import Alignment from "$components/ui/Alignment.svelte";

  import { TextAlign } from "$lib/constants";

  let { align = TextAlign.LEFT } = $props();
</script>

<Alignment bind:align />

<div data-testid="align-value">{align}</div>
