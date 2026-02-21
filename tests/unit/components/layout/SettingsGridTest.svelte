<script>
  import SettingsGrid from "$components/layout/SettingsGrid.svelte";
  import Icon from "~icons/lucide/settings";
</script>

<SettingsGrid label="Test Grid" icon={Icon}>
  <div data-testid="item1">Item 1</div>
  <div data-testid="item2">Item 2</div>
  <div data-testid="item3">Item 3</div>
</SettingsGrid>
