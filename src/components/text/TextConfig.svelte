<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import SettingsGrid from "$components/layout/SettingsGrid.svelte";
  import SettingsRow from "$components/layout/SettingsRow.svelte";
  import Alignment from "$components/ui/Alignment.svelte";
  import ColorPicker from "$components/ui/ColorPicker.svelte";
  import RangeSlider from "$components/ui/RangeSlider.svelte";
  import SelectFont from "$components/ui/SelectFont.svelte";
</script>

<Card title="Настройки текста">
  <SettingsGrid>
    <SettingsRow label="Размер">
      <RangeSlider />
    </SettingsRow>
    <SettingsRow label="Шрифт">
      <SelectFont />
    </SettingsRow>
    <SettingsRow label="Цвет">
      <ColorPicker />
    </SettingsRow>
    <SettingsRow label="Выравнивание">
      <Alignment />
    </SettingsRow>
    <SettingsRow label="Отступы">
      <RangeSlider />
    </SettingsRow>
    <SettingsRow label="Смещение">
      <RangeSlider />
    </SettingsRow>
  </SettingsGrid>
</Card>
