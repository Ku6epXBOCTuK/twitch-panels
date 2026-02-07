<script lang="ts">
  import { PANEL_SETTINGS } from "$lib/constants";
  import { imageConfigState } from "$states/imageConfig.svelte";
  import { textConfigState } from "$states/textConfig.svelte";
  import { Image, Layer, Stage, Text } from "svelte-konva";

  interface Props {
    text: string;
    stage: Stage | undefined;
  }

  let { text, stage = $bindable() }: Props = $props();

  let image: HTMLImageElement | undefined = imageConfigState.image;

  let x = $derived(textConfigState.paddingX);
  let y = $derived(10 + textConfigState.offsetY);
  let width = $derived(PANEL_SETTINGS.PANEL_WIDTH - 2 * textConfigState.paddingX);
  let height = PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT;
</script>

<Stage width={320} height={100} bind:this={stage}>
  <Layer>
    <Image {image}></Image>
    <Text
      {text}
      {x}
      {y}
      {width}
      {height}
      fontSize={textConfigState.fontSize}
      fill={textConfigState.color}
      fontFamily={textConfigState.fontFamily}
      align={textConfigState.align}
      wrap="none"
      ellipsis={true}
    />
  </Layer>
</Stage>
