<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Select as SelectPrimitive } from 'bits-ui';
	import { getFormField } from 'formsnap';

	type $$Props = SelectPrimitive.TriggerProps & {
		placeholder?: string;
	};
	type $$Events = SelectPrimitive.TriggerEvents;
	const { attrStore } = getFormField();
	export let placeholder = '';

	$: attrs = {
		'data-fs-select': '',
		...$attrStore
	};
</script>

<Select.Trigger {...$$restProps} {...attrs} on:click on:keydown type="button">
	<Select.Value {placeholder} />
	<slot />
</Select.Trigger>
