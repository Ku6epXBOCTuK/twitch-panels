<script lang="ts">
  import AppHeader from "$components/layout/AppHeader.svelte";
  import { PANEL_SETTINGS } from "$lib/constants";
  import { imageConfigState } from "$states/imageConfig.svelte";
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
    await imageConfigState.uploadImageByLink(PANEL_SETTINGS.DEFAULT_BACKGROUND_IMAGE);
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
