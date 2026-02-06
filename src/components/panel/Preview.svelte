<script lang="ts">
  import type { SlideDirection } from "$lib/util-types";
  import { imageConfigState } from "$states/image.svelte";
  import { Image, Layer, Stage, Text } from "svelte-konva";
  import { fly } from "svelte/transition";

  interface Props {
    text: string;
    direction: SlideDirection;
  }

  let { text, direction }: Props = $props();

  let xDirection = $derived(direction == "next" ? 320 : -320);

  let image: HTMLImageElement | undefined = imageConfigState.image;
</script>

<div class="konva-wrapper" in:fly={{ x: xDirection, duration: 300 }} out:fly={{ x: -xDirection, duration: 300 }}>
  <Stage width={320} height={100}>
    <Layer>
      <Image {image}></Image>
      {$inspect(image)}
      <Text {text} x={10} y={10} fontsize="32" fill="white"></Text>
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
