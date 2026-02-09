<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import SettingsGrid from "$components/layout/SettingsGrid.svelte";
  import SettingsRow from "$components/layout/SettingsRow.svelte";
  import Button from "$components/ui/Button.svelte";
  import RangeSlider from "$components/ui/RangeSlider.svelte";
  // import { Pencil, RotateCcw as Reset, Upload } from "@lucide/svelte";
  // import Pencil from "@lucide/svelte/icons/pencil";
  // import Reset from "@lucide/svelte/icons/rotate-ccw";
  // import Upload from "@lucide/svelte/icons/upload";
  import Pencil from "~icons/lucide/pencil";
  import Reset from "~icons/lucide/rotate-ccw";
  import Upload from "~icons/lucide/upload";
  import CropInline from "./CropInline.svelte";

  let brightness = $state(100);
  let contrast = $state(100);
</script>

<Card title="Фоновое изображение">
  <div class="crop-editor">
    <CropInline />

    <div class="crop-controls">
      <Button label="Загрузить" ariaLabel="Upload" icon={Upload} type="secondary" />
      <Button label="Редактировать" ariaLabel="Edit" icon={Reset} type="outline" />
      <Button label="Сбросить" ariaLabel="Reset" icon={Pencil} type="outline" />
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
