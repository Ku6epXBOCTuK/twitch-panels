<script lang="ts">
  interface Props {
    text: string | number;
  }

  let { text }: Props = $props();
</script>

<span class="badge" id="panelCount">{text}</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background: var(--accent-light);
    color: var(--accent-primary);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
  }
</style>
