<script lang="ts">
  import { TextAlign, type TextAlignType } from "$lib/constants";
  import TextAlignCenter from "~icons/lucide/text-align-center";
  import TextAlignEnd from "~icons/lucide/text-align-end";
  import TextAlignStart from "~icons/lucide/text-align-start";
  import Button from "./Button.svelte";

  interface Props {
    align: TextAlignType;
  }

  let { align = $bindable(TextAlign.LEFT) }: Props = $props();

  function onAlignLeft() {
    align = TextAlign.LEFT;
  }
  function onAlignCenter() {
    align = TextAlign.CENTER;
  }
  function onAlignRight() {
    align = TextAlign.RIGHT;
  }
</script>

<Button
  icon={TextAlignStart}
  ariaLabel="Set left"
  onclick={onAlignLeft}
  type={align === TextAlign.LEFT ? "primary" : "outline"}
  extra="grow"
/>
<Button
  icon={TextAlignCenter}
  ariaLabel="Set center"
  onclick={onAlignCenter}
  type={align === TextAlign.CENTER ? "primary" : "outline"}
  extra="grow"
/>
<Button
  icon={TextAlignEnd}
  ariaLabel="Set right"
  onclick={onAlignRight}
  type={align === TextAlign.RIGHT ? "primary" : "outline"}
  extra="grow"
/>
