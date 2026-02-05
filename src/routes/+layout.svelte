<script lang="ts">
  import AppHeader from "$components/layout/AppHeader.svelte";
  import { themeState } from "$states/theme.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  $effect(() => {
    const newTheme = themeState.theme;
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  let { children }: Props = $props();
</script>

<div class="container">
  <AppHeader />
  {@render children()}
</div>

<style>
  :root {
    --bg-primary: #ffffff;
    --bg-secondary: #fafafa;
    --bg-card: #ffffff;
    --bg-hover: #f5f5f5;

    --text-primary: #1a1a1a;
    --text-secondary: #666666;
    --text-tertiary: #999999;

    --border-color: #e5e5e5;
    --border-hover: #d4d4d4;

    --accent-primary: #6366f1;
    --accent-hover: #4f46e5;
    --accent-light: #eef2ff;

    --danger: #ef4444;

    --shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);

    --radius: 8px;
    --transition: all 0.15s ease;
  }

  :global([data-theme="dark"]) {
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a1a;
    --bg-card: #1a1a1a;
    --bg-hover: #2a2a2a;

    --text-primary: #f5f5f5;
    --text-secondary: #a3a3a3;
    --text-tertiary: #737373;

    --border-color: #2a2a2a;
    --border-hover: #3a3a3a;

    --accent-primary: #818cf8;
    --accent-hover: #6366f1;
    --accent-light: #312e81;

    --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    padding: 16px;
    transition: var(--transition);
    line-height: 1.5;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
</style>
