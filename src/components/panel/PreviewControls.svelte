<script lang="ts">
  import Button from "$components/ui/Button.svelte";
  import type { SlideDirectionType } from "$lib/constants";
  import { PANEL_SETTINGS } from "$lib/constants";
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

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

  let xDirection = $derived(direction == "next" ? PANEL_SETTINGS.PANEL_WIDTH : -PANEL_SETTINGS.PANEL_WIDTH);
</script>

<Button icon={ChevronLeft} type="mini" onclick={prev} disabled={isFirst} />
<span class="panel-indicator">{current + 1} / {max}</span>
<Button icon={ChevronRight} type="mini" onclick={next} disabled={isLast} />

<style>
  .panel-indicator {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
    min-width: 50px;
    text-align: center;
  }
</style>
