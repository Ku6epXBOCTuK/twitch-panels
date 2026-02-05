<input type="color" value="#ffffff" class="color-input" />
<span class="color-value">#ffffff</span>

<style>
  .color-input {
    width: 40px;
    height: 32px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
    background: var(--bg-primary);
  }

  .color-input:hover {
    border-color: var(--accent-primary);
  }

  .color-value {
    font-family: "Courier New", monospace;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    padding: 4px 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
  }
</style>
