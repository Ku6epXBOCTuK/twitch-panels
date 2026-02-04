<script lang="ts">
  import { uiStore } from "../stores/uiStore";
  import ImageManager from "./ImageManager.svelte";
  import TextSection from "./TextSection.svelte";

  interface Props {
    uploadedImage: string | null;
    texts: Array<{ id: string; text: string }>;
    onImageUpload: (image: string) => void;
    onCropComplete: (croppedImage: string) => void;
    onCropCancel: () => void;
    onTextAdd: (text: string) => void;
    onTextUpdate: (id: string, newText: string) => void;
    onTextDelete: (id: string) => void;
  }

  let {
    uploadedImage,
    texts,
    onImageUpload,
    onCropComplete,
    onCropCancel,
    onTextAdd,
    onTextUpdate,
    onTextDelete
  }: Props = $props();
</script>

<div class="main-section">
  <ImageManager
    currentStep={$uiStore.currentStep}
    {uploadedImage}
    onImageUpload={onImageUpload}
    onCropComplete={onCropComplete}
    onCropCancel={onCropCancel}
  />
  {#if $uiStore.currentStep === "text"}
    <TextSection
      {texts}
      onTextAdd={onTextAdd}
      onTextUpdate={onTextUpdate}
      onTextDelete={onTextDelete}
    />
  {/if}
</div>

<style>
  .main-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
