<script lang="ts">
  //   import { Stage, Layer, Image, Text } from "svelte-konva";
  import type { PageProps } from "./$types";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let { data }: PageProps = $props();

  let Stage: any = $state(undefined);
  let Layer: any = $state(undefined);
  let Image: any = $state(undefined);
  let Text: any = $state(undefined);

  // svelte-ignore state_referenced_locally
  let images = data.images;
  // svelte-ignore state_referenced_locally
  let fonts = data.fonts;
  console.log(images);
  console.log(fonts);

  let fontsStyle = fonts
    .map(({ name, url, file, format }: { name: string; url: string; file: string; format: string }) => {
      const result = `
        @font-face {
          font-family: '${name}';
          src: url('${url}') format(${format});
          
        }
      `;
      return result;
    })
    .join("");

  let selectedImage = $state(0);
  let text = $state("текст");
  let selectedFont = $state("");

  let image: HTMLImageElement | undefined = $state(undefined);

  $effect(() => {
    const img = document.createElement("img");
    img.src = `./backgrounds/${images[selectedImage]}`;
    img.onload = () => (image = img);
  });

  onMount(async () => {
    if (!browser) return;

    const svelteKonva = await import("svelte-konva");
    Stage = svelteKonva.Stage;
    Layer = svelteKonva.Layer;
    Image = svelteKonva.Image;
    Text = svelteKonva.Text;
  });

  function download() {}
</script>

<svelte:head>
  {@html `
    <style>
      ${fontsStyle}
    </style>
  `}
</svelte:head>

<div class="preview">
  <h1>Preview</h1>

  <Stage width={320} height={100}>
    <Layer>
      <Image
        {image}
        width="320"
        height="100"
        crop={{
          x: 0,
          y: 0,
          width: 320,
          height: 100,
        }}
      />
      <Text
        {text}
        fontSize={18}
        fill="white"
        fontFamily={selectedFont}
        align="center"
        verticalAlign="middle"
        width="320"
        height="100"
      />
    </Layer>
  </Stage>
</div>

<label>
  Введите текст:
  <input type="text" bind:value={text} />
</label>
<label>
  Выберите шрифт:
  <select bind:value={selectedFont}>
    {#each fonts as font}
      <option value={font.name}>{font.name}</option>
    {/each}
  </select>
</label>

<button onclick={download}>Скачать</button>

<div class="img-selection">
  {#each images as image, idx (image)}
    <button class="img-select-button" onclick={() => (selectedImage = idx)}>
      <img src={`./backgrounds/${image}`} alt="img selection" />
    </button>
  {/each}
</div>

<style>
  .img-select-button {
    border: none;
    padding: 0;
    margin: 8px;
  }
</style>
