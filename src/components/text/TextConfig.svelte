<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import SettingsGrid from "$components/layout/SettingsGrid.svelte";
  import SettingsRow from "$components/layout/SettingsRow.svelte";
  import Alignment from "$components/ui/Alignment.svelte";
  import ColorPicker from "$components/ui/ColorPicker.svelte";
  import RangeSlider from "$components/ui/RangeSlider.svelte";
  import SelectFont from "$components/ui/SelectFont.svelte";
  import { textConfigState } from "$states/textConfig.svelte";
</script>

<Card title="Настройки текста">
  <SettingsGrid>
    <SettingsRow label="Размер">
      <RangeSlider bind:value={textConfigState.fontSize} min={10} max={100} step={1} />
    </SettingsRow>
    <SettingsRow label="Шрифт">
      <SelectFont bind:value={textConfigState.fontFamily} />
    </SettingsRow>
    <SettingsRow label="Цвет">
      <ColorPicker bind:value={textConfigState.color} />
    </SettingsRow>
    <SettingsRow label="Выравнивание" noLabel={true}>
      <Alignment bind:align={textConfigState.align} />
    </SettingsRow>
    <SettingsRow label="Отступы">
      <RangeSlider bind:value={textConfigState.paddingX} min={0} max={100} step={1} />
    </SettingsRow>
    <SettingsRow label="Смещение">
      <RangeSlider bind:value={textConfigState.offsetY} min={-100} max={100} step={1} />
    </SettingsRow>
  </SettingsGrid>
</Card>
