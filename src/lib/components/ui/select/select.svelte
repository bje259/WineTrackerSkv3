<script lang="ts">
import { Select as SelectPrimitive } from 'bits-ui';

type SelectedType = any; // replace 'any' with the actual type
type $$Props = SelectPrimitive.Props<SelectedType>;

export let selected: $$Props['selected'] = undefined;
export let open: $$Props['open'] = undefined;
</script>

<SelectPrimitive.Root bind:selected={selected} bind:open={open} {...$$restProps}>
	<slot />
</SelectPrimitive.Root>
