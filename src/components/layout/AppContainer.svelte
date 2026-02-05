<script lang="ts">
  import ErrorMessage from "$components/feedback/ErrorMessage.svelte";
  import AppContent from "$components/layout/AppContent.svelte";

  interface Props {
    errorMessage: string | undefined;
    uploadedImage: string | undefined;
    texts: Array<{ id: string; text: string }>;
    backgroundImage: string | undefined;
    panels: any[];
    onUploadNewImage: () => void;
    onImageUpload: (image: string) => void;
    onCropComplete: (croppedImage: string) => void;
    onCropCancel: () => void;
    onTextAdd: (text: string) => void;
    onTextUpdate: (id: string, newText: string) => void;
    onTextDelete: (id: string) => void;
    onDownload: (panel: any, konvaStage: any) => Promise<void>;
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
    onDownloadAll,
  }: Props = $props();
</script>

<div class="app-container">
  <ErrorMessage {errorMessage} />

  <AppContent
    {uploadedImage}
    {texts}
    {backgroundImage}
    {panels}
    {onImageUpload}
    {onCropComplete}
    {onCropCancel}
    {onTextAdd}
    {onTextUpdate}
    {onTextDelete}
    {onUploadNewImage}
    {onDownload}
    {onDownloadAll}
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
