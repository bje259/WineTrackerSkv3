<script lang="ts">
  import { getFormField } from "formsnap";
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import type { TextareaGetFormField } from ".";
  import { Textarea, type TextareaEvents } from "$lib/components/ui/textarea";

  type $$Props = HTMLTextareaAttributes;
  type $$Events = TextareaEvents;

  const { attrStore, value } = getFormField() as TextareaGetFormField;
  export let rows: $$Props["rows"] = undefined;
  $: attrs = {
    "data-fs-textarea": "",
    ...$attrStore,
  };
</script>

<Textarea
  {...attrs}
  bind:value={$value}
  {rows}
  {...$$restProps}
  on:blur
  on:change
  on:click
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  on:input
/>
