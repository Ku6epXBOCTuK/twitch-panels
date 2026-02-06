<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import IconArrowLeft from "$components/ui/Icons/IconArrowLeft.svelte";
  import IconArrowRight from "$components/ui/Icons/IconArrowRight.svelte";
  import type { SlideDirection } from "$lib/types/utils";

  interface Props {
    current: number;
    direction: SlideDirection;
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

<Button icon={IconArrowLeft} type="mini" onclick={prev} disabled={isFirst} />
<span class="panel-indicator">{current + 1} / {max}</span>
<Button icon={IconArrowRight} type="mini" onclick={next} disabled={isLast} />

<style>
  .panel-indicator {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
    min-width: 50px;
    text-align: center;
  }
</style>
