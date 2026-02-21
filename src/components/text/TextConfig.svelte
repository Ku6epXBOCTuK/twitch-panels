<script lang="ts">
  import Card from "$components/layout/Card.svelte";
  import SettingsGrid from "$components/layout/SettingsGrid.svelte";
  import SettingsRow from "$components/layout/SettingsRow.svelte";
  import Alignment from "$components/ui/Alignment.svelte";
  import ColorPicker from "$components/ui/ColorPicker.svelte";
  import Outline from "$components/ui/Outline.svelte";
  import RangeSlider from "$components/ui/RangeSlider.svelte";
  import SelectFont from "$components/ui/SelectFont.svelte";
  import { TYPOGRAPHY } from "$lib/constants";
  import { textConfigState } from "$states/textConfig.svelte";
  import TextSettings from "~icons/lucide/text-initial";
</script>

<Card title="Настройки текста">
  <SettingsGrid label="Настройки шрифта" icon={TextSettings}>
    <SettingsRow label="Размер">
      <RangeSlider
        bind:value={textConfigState.fontSize}
        min={TYPOGRAPHY.FONT_SIZE_MIN}
        max={TYPOGRAPHY.FONT_SIZE_MAX}
        step={1}
      />
    </SettingsRow>
    <SettingsRow label="Шрифт">
      <SelectFont bind:value={textConfigState.fontFamily} />
    </SettingsRow>
    <SettingsRow label="Цвет" noLabel={true}>
      <ColorPicker bind:value={textConfigState.color} />
      <Outline bind:outlined={textConfigState.outlined} />
    </SettingsRow>
    <SettingsRow label="Выравнивание" noLabel={true}>
      <Alignment bind:align={textConfigState.align} />
    </SettingsRow>
    <SettingsRow label="Отступы">
      <RangeSlider
        bind:value={textConfigState.paddingX}
        min={TYPOGRAPHY.PADDING_X_MIN}
        max={TYPOGRAPHY.PADDING_X_MAX}
        step={1}
      />
    </SettingsRow>
    <SettingsRow label="Смещение">
      <RangeSlider
        bind:value={textConfigState.offsetY}
        min={TYPOGRAPHY.OFFSET_Y_MIN}
        max={TYPOGRAPHY.OFFSET_Y_MAX}
        step={1}
      />
    </SettingsRow>
  </SettingsGrid>
</Card>
