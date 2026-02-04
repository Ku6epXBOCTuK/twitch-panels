<script lang="ts">
  import { uiStore } from "../../stores/uiStore";
  import ImageManager from "../image/ImageManager.svelte";
  import TextSection from "../text/TextSection.svelte";

  interface Props {
    uploadedImage: string | undefined;
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
    onTextDelete,
  }: Props = $props();
</script>

<div class="main-section">
  <ImageManager currentStep={$uiStore.currentStep} {uploadedImage} {onImageUpload} {onCropComplete} {onCropCancel} />
  {#if $uiStore.currentStep === "text"}
    <TextSection {texts} {onTextAdd} {onTextUpdate} {onTextDelete} />
  {/if}
</div>

<style>
  .main-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
