<script lang="ts">
  import { PANEL_SETTINGS } from "$lib/constants";
  import { imageState } from "$states/image.svelte";
  import { textConfigState } from "$states/textConfig.svelte";
  import { Image, Layer, Stage, Text } from "svelte-konva";

  interface Props {
    text: string;
    stage: Stage | undefined;
  }

  let { text, stage = $bindable() }: Props = $props();

  let x = $derived(textConfigState.paddingX);
  let y = $derived(textConfigState.offsetY);
  let width = $derived(PANEL_SETTINGS.PANEL_WIDTH - 2 * textConfigState.paddingX);
  let height = PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT;
</script>

<Stage
  width={PANEL_SETTINGS.PANEL_WIDTH}
  height={PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT}
  bind:this={stage}
>
  <Layer>
    <Image image={imageState.croppedImage}></Image>
    <Text
      {text}
      {x}
      {y}
      {width}
      {height}
      fontSize={textConfigState.fontSize}
      stroke={textConfigState.color}
      fill="transparent"
      fontFamily={textConfigState.fontFamily}
      align={textConfigState.align}
      wrap="none"
      ellipsis={true}
    />
  </Layer>
</Stage>
