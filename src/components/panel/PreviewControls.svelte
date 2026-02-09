<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import type { SlideDirectionType } from "$lib/constants";
  import ChevronLeft from "~icons/lucide/chevron-left";
  import ChevronRight from "~icons/lucide/chevron-right";

  interface Props {
    current: number;
    direction: SlideDirectionType;
    max: number;
  }

  let { current = $bindable(), direction = $bindable("next"), max }: Props = $props();

  let isFirst = $derived(current === 0);
  let isLast = $derived(current === max - 1);

  function prev() {
    if (current > 0) current--;
    direction = "prev";
  }

  function next() {
    if (current < max - 1) current++;
    direction = "next";
  }
</script>

<Button icon={ChevronLeft} ariaLabel="Previous slide" type="mini" onclick={prev} disabled={isFirst} />
<span class="panel-indicator">{current + 1} / {max}</span>
<Button icon={ChevronRight} ariaLabel="Next slide" type="mini" onclick={next} disabled={isLast} />

<style>
  .panel-indicator {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
    min-width: 50px;
    text-align: center;
  }
</style>
