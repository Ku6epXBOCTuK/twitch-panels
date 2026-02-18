<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import SettingsGrid from "$components/layout/SettingsGrid.svelte";
  import SettingsRow from "$components/layout/SettingsRow.svelte";
  import Button from "$components/ui/Button.svelte";
  import RangeSlider from "$components/ui/RangeSlider.svelte";
  import { IMAGE_SETTINGS } from "$lib/constants";
  import { uploadService } from "$services/uploadService";
  import { imageState } from "$states/image.svelte";
  import Pencil from "~icons/lucide/pencil";
  import Reset from "~icons/lucide/rotate-ccw";
  import Upload from "~icons/lucide/upload";
  import CropInline from "./CropInline.svelte";

  let brightness = $state(IMAGE_SETTINGS.DEFAULT_BRIGHTNESS);
  let contrast = $state(IMAGE_SETTINGS.DEFAULT_CONTRAST);
  let hue = $state(IMAGE_SETTINGS.DEFAULT_HUE);
  let chroma = $state(IMAGE_SETTINGS.DEFAULT_CHROMA);

  async function handlePaste(event: ClipboardEvent) {
    let image = await uploadService.fromClipboard(event);
    if (image.ok) {
      imageState.fullImage = image.data;
    }
  }
</script>

<Card title="Фоновое изображение">
  <div class="crop-editor">
    <CropInline />

    <div class="crop-controls">
      <Button label="Загрузить" ariaLabel="Upload" icon={Upload} type="primary" />
      <Button label="Редактировать" ariaLabel="Edit" icon={Pencil} type="secondary" />
      <Button label="Сбросить" ariaLabel="Reset" icon={Reset} type="outline" />
    </div>

    <SettingsGrid>
      <SettingsRow label="Смещение цвета">
        <RangeSlider bind:value={hue} min={IMAGE_SETTINGS.HUE_MIN} max={IMAGE_SETTINGS.HUE_MAX} />
      </SettingsRow>
      <SettingsRow label="Насыщенность">
        <RangeSlider
          bind:value={chroma}
          min={IMAGE_SETTINGS.CHROMA_MIN}
          max={IMAGE_SETTINGS.CHROMA_MAX}
        />
      </SettingsRow>
      <SettingsRow label="Яркость">
        <RangeSlider
          bind:value={brightness}
          min={IMAGE_SETTINGS.BRIGHTNESS_MIN}
          max={IMAGE_SETTINGS.BRIGHTNESS_MAX}
        />
      </SettingsRow>
      <SettingsRow label="Контраст">
        <RangeSlider
          bind:value={contrast}
          min={IMAGE_SETTINGS.CONTRAST_MIN}
          max={IMAGE_SETTINGS.CONTRAST_MAX}
        />
      </SettingsRow>
    </SettingsGrid>
  </div>
</Card>

<svelte:window onpaste={handlePaste} />

<style>
  .crop-editor {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .crop-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
</style>
