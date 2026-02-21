<script lang="ts">
  import PreviewControls from "$components/panel/PreviewControls.svelte";

  import { SlideDirection } from "$lib/constants";

  let { current = 0, max = 5 } = $props();
  let direction = $state(SlideDirection.NEXT);
</script>

<PreviewControls bind:current bind:direction {max} />

<div data-testid="current">{current}</div>
<div data-testid="direction">{direction}</div>
