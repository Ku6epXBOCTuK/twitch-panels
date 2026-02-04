<script lang="ts">
  import ImageUpload from "./ImageUpload.svelte";
  import ImageCropper from "./ImageCropper.svelte";

  let {
    currentStep,
    uploadedImage,
    onImageUpload,
    onCropComplete,
    onCropCancel
  }: {
    currentStep: string;
    uploadedImage: string | null;
    onImageUpload: (image: string) => void;
    onCropComplete: (croppedImage: string) => void;
    onCropCancel: () => void;
  } = $props();
</script>

{#if currentStep === "upload"}
  <ImageUpload onImageSelect={onImageUpload} />
{:else if currentStep === "crop" && uploadedImage}
  <ImageCropper imageSrc={uploadedImage} onCropComplete={onCropComplete} onCancel={onCropCancel} />
{/if}
