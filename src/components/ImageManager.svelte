<script lang="ts">
  import ImageUpload from "./ImageUpload.svelte";
  import ImageCropper from "./ImageCropper.svelte";

  interface Props {
    currentStep: string;
    uploadedImage: string | null;
    onImageUpload: (image: string) => void;
    onCropComplete: (croppedImage: string) => void;
    onCropCancel: () => void;
  }

  let { currentStep, uploadedImage, onImageUpload, onCropComplete, onCropCancel }: Props = $props();
</script>

{#if currentStep === "upload"}
  <ImageUpload onImageSelect={onImageUpload} />
{:else if currentStep === "crop" && uploadedImage}
  <ImageCropper imageSrc={uploadedImage} {onCropComplete} onCancel={onCropCancel} />
{/if}
