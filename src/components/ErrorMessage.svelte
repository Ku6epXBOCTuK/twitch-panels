<script lang="ts">
  interface Props {
    errorMessage: string | undefined;
  }

  let { errorMessage }: Props = $props();
</script>

{#if errorMessage}
  <div class="error-message">
    {errorMessage}
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
