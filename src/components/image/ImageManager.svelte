<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import SettingsGrid from "$components/layout/SettingsGrid.svelte";
  import SettingsRow from "$components/layout/SettingsRow.svelte";
  import Button from "$components/ui/Button.svelte";
  import IconEdit from "$components/ui/Icons/IconEdit.svelte";
  import IconReset from "$components/ui/Icons/IconReset.svelte";
  import IconUpload from "$components/ui/Icons/IconUpload.svelte";
  import RangeSlider from "$components/ui/RangeSlider.svelte";
  import CropInline from "./CropInline.svelte";

  let brightness = $state(100);
  let contrast = $state(100);
</script>

<Card title="Фоновое изображение">
  <div class="crop-editor">
    <CropInline />

    <div class="crop-controls">
      <Button label="Загрузить" icon={IconUpload} type="secondary" />
      <Button label="Редактировать" icon={IconEdit} type="outline" />
      <Button label="Сбросить" icon={IconReset} type="outline" />
    </div>

    <SettingsGrid>
      <SettingsRow label="Яркость">
        <RangeSlider bind:value={brightness} />
      </SettingsRow>
      <SettingsRow label="Контраст">
        <RangeSlider bind:value={contrast} min={50} max={150} />
      </SettingsRow>
    </SettingsGrid>
  </div>
</Card>

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
