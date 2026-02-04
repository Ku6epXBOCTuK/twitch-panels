<script lang="ts">
  import AppHeader from "./AppHeader.svelte";
  import ErrorMessage from "./ErrorMessage.svelte";
  import AppContent from "./AppContent.svelte";

  interface Props {
    errorMessage: string | null;
    uploadedImage: string | null;
    texts: Array<{ id: string; text: string }>;
    backgroundImage: string | null;
    panels: any[];
    onUploadNewImage: () => void;
    onImageUpload: (image: string) => void;
    onCropComplete: (croppedImage: string) => void;
    onCropCancel: () => void;
    onTextAdd: (text: string) => void;
    onTextUpdate: (id: string, newText: string) => void;
    onTextDelete: (id: string) => void;
    onDownload: (panel: any) => Promise<void>;
    onDownloadAll: () => Promise<void>;
  }

  let {
    errorMessage,
    uploadedImage,
    texts,
    backgroundImage,
    panels,
    onUploadNewImage,
    onImageUpload,
    onCropComplete,
    onCropCancel,
    onTextAdd,
    onTextUpdate,
    onTextDelete,
    onDownload,
    onDownloadAll
  }: Props = $props();
</script>

<div class="app-container">
  <AppHeader onUploadNewImage={onUploadNewImage} />

  <ErrorMessage {errorMessage} />

  <AppContent
    {uploadedImage}
    {texts}
    {backgroundImage}
    {panels}
    onImageUpload={onImageUpload}
    onCropComplete={onCropComplete}
    onCropCancel={onCropCancel}
    onTextAdd={onTextAdd}
    onTextUpdate={onTextUpdate}
    onTextDelete={onTextDelete}
    onUploadNewImage={onUploadNewImage}
    onDownload={onDownload}
    onDownloadAll={onDownloadAll}
  />
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
