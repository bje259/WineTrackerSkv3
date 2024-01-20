<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLThAttributes } from "svelte/elements";
  interface Resize {
    (node: Element): void;
    drag: (node: Element) => void;
    reset: (node: Element) => void;
    disabled: boolean;
  }
  type IResize = Resize | undefined;

  export let resize: IResize = undefined;

  type $$Props = HTMLThAttributes & { resize?: IResize };

  let className: $$Props["class"] = undefined;

  export { className as class };
</script>

{#if resize}
  <th
    class={cn(
      "shadth h-12 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:text-center ml-auto",
      className
    )}
    {...$$restProps}
    use:resize
  >
    <slot />
  </th>
{:else}
  <th
    class={cn(
      "shadth h-12 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:text-center ml-auto",
      className
    )}
    {...$$restProps}
  >
    <slot />
  </th>
{/if}
