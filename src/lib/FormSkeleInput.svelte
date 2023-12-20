<script lang="ts">
	import { type InputEvents } from '$lib/components/ui/input';
	import { getFormField } from 'formsnap';
	import type { HTMLInputAttributes } from 'svelte/elements';
    import {cn} from "$utils";
    //export let value: $$Props['value'] = undefined;
    let className: string | undefined | null = undefined;
	export { className as class };

	type $$Props = HTMLInputAttributes;
	type $$Events = InputEvents;

	const { attrStore, value } = getFormField();

	$: attrs = {
		'data-fs-input': '',
		...$attrStore
	};

</script>

<input
	class={cn(
		"input flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0  file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	type="date"
    {...attrs}
    bind:value={$value}
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
	{...$$restProps}
/>


