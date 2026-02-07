<script lang="ts">
  import { PANEL_SETTINGS, type SlideDirectionType } from "$lib/constants";
  import { imageConfigState } from "$states/imageConfig.svelte";
  import { textConfigState } from "$states/textConfig.svelte";
  import { Image, Layer, Stage, Text } from "svelte-konva";
  import { fly } from "svelte/transition";

  interface Props {
    text: string;
    direction: SlideDirectionType;
  }

  let { text, direction }: Props = $props();

  let xDirection = $derived(direction == "next" ? PANEL_SETTINGS.PANEL_WIDTH : -PANEL_SETTINGS.PANEL_WIDTH);

  let image: HTMLImageElement | undefined = imageConfigState.image;

  let { align, fontSize, fontFamily, paddingX, offsetY, color } = textConfigState;

  let x = $derived(paddingX);
  let y = $derived(10 + offsetY);
  let width = $derived(PANEL_SETTINGS.PANEL_WIDTH - 2 * paddingX);
  let height = PANEL_SETTINGS.PANEL_HEIGHT_DEFAULT;
</script>

<div class="konva-wrapper" in:fly={{ x: xDirection, duration: 300 }} out:fly={{ x: -xDirection, duration: 300 }}>
  <Stage width={320} height={100}>
    <Layer>
      <Image {image}></Image>
      {$inspect(paddingX)}
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
</div>

<style>
  .konva-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
