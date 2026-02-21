<script lang="ts">
  import { themeState } from "$states/theme.svelte";
  import Moon from "~icons/lucide/moon";
  import Sun from "~icons/lucide/sun";

  function toggleTheme() {
    themeState.toggle();
  }
</script>

<header class="header">
  <div class="header-content">
    <h1>Twitch Panels</h1>
    <button class="theme-toggle" aria-label="Toggle theme" onclick={toggleTheme}>
      <Sun class="sun-icon" />
      <Moon class="moon-icon" />
    </button>
  </div>
</header>

<style>
  .header {
    background: linear-gradient(135deg, var(--action-primary) 0%, var(--action-secondary) 100%);
    color: var(--text-action);
    padding: 16px 20px;
    border-radius: var(--radius);
    margin-bottom: 16px;
    box-shadow: var(--shadow-md);
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
