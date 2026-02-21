<script lang="ts">
  import TypeOutline from "~icons/lucide/type-outline";
  import Button from "./Button.svelte";

  interface Props {
    outlined: boolean;
  }

  let { outlined = $bindable(false) }: Props = $props();
</script>

<Button
  icon={TypeOutline}
  ariaLabel="toggle outline"
  onclick={() => (outlined = !outlined)}
  type={outlined ? "outline" : "primary"}
/>
