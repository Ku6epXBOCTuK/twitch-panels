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
  import Sliders from "~icons/lucide/sliders-horizontal";
  import Upload from "~icons/lucide/upload";
  import CropInline from "./CropInline.svelte";

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

    <SettingsGrid label="Настройки изображения" icon={Sliders}>
      <SettingsRow label="Сдвиг цвета">
        <RangeSlider
          bind:value={imageState.hue}
          min={IMAGE_SETTINGS.HUE_MIN}
          max={IMAGE_SETTINGS.HUE_MAX}
          defaultValue={IMAGE_SETTINGS.HUE_DEFAULT}
          showReset={true}
        />
      </SettingsRow>
      <SettingsRow label="Насыщенность">
        <RangeSlider
          bind:value={imageState.saturation}
          min={IMAGE_SETTINGS.SATURATION_MIN}
          max={IMAGE_SETTINGS.SATURATION_MAX}
          defaultValue={IMAGE_SETTINGS.SATURATION_DEFAULT}
          showReset={true}
        />
      </SettingsRow>
      <SettingsRow label="Яркость">
        <RangeSlider
          bind:value={imageState.luminance}
          min={IMAGE_SETTINGS.LUMINANCE_MIN}
          max={IMAGE_SETTINGS.LUMINANCE_MAX}
          defaultValue={IMAGE_SETTINGS.LUMINANCE_DEFAULT}
          showReset={true}
        />
      </SettingsRow>
      <SettingsRow label="Светлота">
        <RangeSlider
          bind:value={imageState.brightness}
          min={IMAGE_SETTINGS.BRIGHTNESS_MIN}
          max={IMAGE_SETTINGS.BRIGHTNESS_MAX}
          defaultValue={IMAGE_SETTINGS.BRIGHTNESS_DEFAULT}
          showReset={true}
        />
      </SettingsRow>
      <SettingsRow label="Контраст">
        <RangeSlider
          bind:value={imageState.contrast}
          min={IMAGE_SETTINGS.CONTRAST_MIN}
          max={IMAGE_SETTINGS.CONTRAST_MAX}
          defaultValue={IMAGE_SETTINGS.CONTRAST_DEFAULT}
          showReset={true}
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
