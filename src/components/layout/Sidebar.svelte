<script lang="ts">
  import BackgroundPreview from "$components/image/BackgroundPreview.svelte";
  import PanelsList from "$components/panel/PanelsList.svelte";
  import { uiStore } from "$stores/uiStore";

  interface Props {
    backgroundImage: string | undefined;
    panels: any[];
    onUploadNewImage: () => void;
    onDownload: (panel: any, konvaStage: any) => Promise<void>;
    onDownloadAll: () => Promise<void>;
  }

  let { backgroundImage, panels, onUploadNewImage, onDownload, onDownloadAll }: Props = $props();
</script>

<div class="sidebar">
  {#if $uiStore.currentStep === "text"}
    <BackgroundPreview {backgroundImage} {onUploadNewImage} />
    <PanelsList {panels} {onDownload} {onDownloadAll} />
  {/if}
</div>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    .sidebar {
      order: -1;
    }
  }
</style>
