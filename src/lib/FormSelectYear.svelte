<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import type { Select as SelectPrimitive } from 'bits-ui';
	import { getFormField } from 'formsnap';

	type SelectedType = number; // replace 'any' with the actual type

	const { setValue, name, value } = getFormField();

	type $$Props = SelectPrimitive.Props<SelectedType>;
	type $$Events = SelectPrimitive.TriggerEvents;

	export let onSelectedChange: $$Props['onSelectedChange'] = undefined;

	const { attrStore } = getFormField();

	//export let value: $$Props['value'] = undefined;

	export let placeholder = ($attrStore.placeholder = {
		value: today(getLocalTimeZone()).year,
		label: String(today(getLocalTimeZone()).year)
	});

	$: defaultYear = placeholder
		? {
				value: placeholder.value,
				label: String(placeholder.label)
			}
		: undefined;

	$: attrs = {
		'data-fs-select': '',
		...$attrStore
	};

	const yearOptions = Array.from({ length: 100 }, (_, i) => ({
		label: String(new Date().getFullYear() - i),
		value: new Date().getFullYear() - i
	}));
</script>

<Select.Root
	selected={defaultYear}
	items={yearOptions}
	onSelectedChange={(v) => {
		if (!v || !placeholder) return;
		if (v.value === placeholder?.value) return;
		onSelectedChange?.(v);
		placeholder = { value: v.value, label: String(v.value) };
		setValue(v ? v.value : undefined);
	}}
>
	<Select.Trigger
		{...$$restProps}
		{...attrs}
		on:click
		on:keydown
		type="button"
		aria-label="Select year"
		class="w-[40%]"
	>
		<Select.Value placeholder="Select year" />
	</Select.Trigger>
	<Select.Content class="max-h-[200px] overflow-y-auto">
		{#each yearOptions as { value, label }}
			<Select.Item {value} {label}>
				{label}
			</Select.Item>
		{/each}
	</Select.Content>
	<input hidden {name} value={$value} />
</Select.Root>
