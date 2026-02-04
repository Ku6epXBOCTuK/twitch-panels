<script lang="ts">
  interface Props {
    message: string | null;
  }

  let { message }: Props = $props();
</script>

{#if message}
  <div class="error-message">
    {message}
  </div>
{/if}

<style>
  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ffcdd2;
    font-weight: 500;
  }
</style>
