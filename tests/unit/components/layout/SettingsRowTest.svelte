<!-- SettingsRowTest.svelte -->
<script>
  import SettingsRow from "$components/layout/SettingsRow.svelte";
</script>

<SettingsRow label="Test Label">
  <input type="text" data-testid="test-input" />
</SettingsRow>
