<input type="range" id="fontSize" min="12" max="48" value="18" class="slider" />
<span class="value-display" id="fontSizeValue">18</span>

<style>
  .slider {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: var(--bg-secondary);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent-primary);
    cursor: pointer;
    transition: var(--transition);
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  .slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent-primary);
    cursor: pointer;
    border: none;
    transition: var(--transition);
  }

  .slider::-moz-range-thumb:hover {
    transform: scale(1.1);
  }

  .value-display {
    color: var(--text-primary);
    font-weight: 500;
    min-width: 40px;
    text-align: right;
    font-size: 13px;
    padding: 4px 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
  }
</style>
