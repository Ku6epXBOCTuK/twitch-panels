<script lang="ts">
  import MainSection from "./MainSection.svelte";
  import Sidebar from "./Sidebar.svelte";

  interface Props {
    uploadedImage: string | undefined;
    texts: Array<{ id: string; text: string }>;
    backgroundImage: string | undefined;
    panels: any[];
    onImageUpload: (image: string) => void;
    onCropComplete: (croppedImage: string) => void;
    onCropCancel: () => void;
    onTextAdd: (text: string) => void;
    onTextUpdate: (id: string, newText: string) => void;
    onTextDelete: (id: string) => void;
    onUploadNewImage: () => void;
    onDownload: (panel: any) => Promise<void>;
    onDownloadAll: () => Promise<void>;
  }

  let {
    uploadedImage,
    texts,
    backgroundImage,
    panels,
    onImageUpload,
    onCropComplete,
    onCropCancel,
    onTextAdd,
    onTextUpdate,
    onTextDelete,
    onUploadNewImage,
    onDownload,
    onDownloadAll,
  }: Props = $props();
</script>

<div class="app-content">
  <MainSection
    {uploadedImage}
    {texts}
    {onImageUpload}
    {onCropComplete}
    {onCropCancel}
    {onTextAdd}
    {onTextUpdate}
    {onTextDelete}
  />
  <Sidebar {backgroundImage} {panels} {onUploadNewImage} {onDownload} {onDownloadAll} />
</div>

<style>
  .app-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 1024px) {
    .app-content {
      grid-template-columns: 1fr;
    }
  }
</style>
