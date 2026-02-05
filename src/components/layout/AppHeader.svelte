<script lang="ts">
  import IconMoon from "$components/ui/Icons/IconMoon.svelte";
  import IconSun from "$components/ui/Icons/IconSun.svelte";
  import { themeState } from "$states/theme.svelte";

  interface Props {}

  let {}: Props = $props();

  function toggleTheme() {
    themeState.toggle();
  }
</script>

<header class="header">
  <div class="header-content">
    <h1>Twitch Panels</h1>
    <button class="theme-toggle" aria-label="Toggle theme" onclick={toggleTheme}>
      <IconSun />
      <IconMoon />
    </button>
  </div>
</header>

<style>
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 20px;
    border-radius: var(--radius);
    margin-bottom: 16px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header h1 {
    font-size: 20px;
    font-weight: 600;
  }

  .theme-toggle {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    position: relative;
  }

  .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  :global(.theme-toggle svg) {
    width: 18px;
    height: 18px;
    position: absolute;
    transition: var(--transition);
  }

  :global(.sun-icon) {
    opacity: 1;
    transform: rotate(0deg);
  }

  :global(.moon-icon) {
    opacity: 0;
    transform: rotate(90deg);
  }

  :global([data-theme="dark"] .sun-icon) {
    opacity: 0;
    transform: rotate(90deg);
  }

  :global([data-theme="dark"] .moon-icon) {
    opacity: 1;
    transform: rotate(0deg);
  }
</style>
