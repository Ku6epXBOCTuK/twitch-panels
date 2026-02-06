<script lang="ts">
  import type { SlideDirection } from "$lib/types/utils";
  import { fly } from "svelte/transition";

  interface Props {
    text: string;
    direction: SlideDirection;
  }

  let { text, direction }: Props = $props();

  let xDirection = $derived(direction == "next" ? 320 : -320);
</script>

<div in:fly={{ x: xDirection, duration: 300 }} out:fly={{ x: -xDirection, duration: 300 }}>
  {text}
</div>
