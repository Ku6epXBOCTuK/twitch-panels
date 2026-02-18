<script lang="ts">
  import AppHeader from "$components/layout/AppHeader.svelte";
  import { IMAGE_SETTINGS } from "$lib/constants";
  import { uploadService } from "$services/uploadService";
  import { imageState } from "$states/image.svelte";
  import { themeState } from "$states/theme.svelte";
  import { onMount, type Snippet } from "svelte";
  import "../app.css";

  interface Props {
    children: Snippet;
  }

  $effect(() => {
    const newTheme = themeState.current;
    document.documentElement.setAttribute("data-theme", newTheme);
  });

  let { children }: Props = $props();

  onMount(async () => {
    let defaultImage = await uploadService.fromUrl(IMAGE_SETTINGS.DEFAULT_BACKGROUND_IMAGE);
    if (defaultImage.ok) {
      imageState.fullImage = defaultImage.data;
    } else {
      console.error("Failed to load default image");
    }
  });
</script>

<div class="container">
  <AppHeader />
  {@render children()}
</div>

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
</style>
