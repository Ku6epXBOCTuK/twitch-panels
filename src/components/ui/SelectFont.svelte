<select class="select-input">
  <option value="Arial">Arial</option>
  <option value="Verdana">Verdana</option>
  <option value="Georgia">Georgia</option>
  <option value="Times New Roman">Times New Roman</option>
  <option value="Courier New">Courier New</option>
  <option value="Impact">Impact</option>
  <option value="Comic Sans MS">Comic Sans MS</option>
  <option value="Trebuchet MS">Trebuchet MS</option>
</select>

<style>
  .select-input {
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 13px;
    cursor: pointer;
    transition: var(--transition);
    font-family: inherit;
    width: 100%;
  }

  .select-input:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
</style>
