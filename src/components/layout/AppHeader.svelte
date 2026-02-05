<script lang="ts">
  interface Props {}

  let {}: Props = $props();

  function toggleTheme() {
    // TODO: need refactoring
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }
</script>

<header class="header">
  <div class="header-content">
    <h1>Twitch Panels</h1>
    <button class="theme-toggle" aria-label="Toggle theme" onclick={toggleTheme}>
      <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  </div>
</header>

<style>
  /* Header */
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

  .theme-toggle svg {
    width: 18px;
    height: 18px;
    position: absolute;
    transition: var(--transition);
  }

  .sun-icon {
    opacity: 1;
    transform: rotate(0deg);
  }

  .moon-icon {
    opacity: 0;
    transform: rotate(90deg);
  }

  :global([data-theme="dark"]) .sun-icon {
    opacity: 0;
    transform: rotate(90deg);
  }

  :global([data-theme="dark"]) .moon-icon {
    opacity: 1;
    transform: rotate(0deg);
  }
</style>
