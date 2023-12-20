<script lang="ts">
	import { Command as CommandPrimitive } from "cmdk-sv";
	import { Search } from "lucide-svelte";
	import { cn } from "$lib/utils";
  import { custom } from "zod";
    export let handleUpdateState: any;
    export let stateStore;
    export let filterFn: (yearIn: string, query: string) => void;

	type $$Props = CommandPrimitive.InputProps & {
        handleUpdateState: any;
        stateStore: any;
        filterFn: (item: any, search: string) => boolean;
    };

	let className: string | undefined | null = undefined;
	export { className as class };
	export let value: string = "";

$: customUpdateState = (key: string, value: string) => {
    let items = $stateStore.filtered.items;
    handleUpdateState(key, value);
};





</script>

<div class="flex items-center border-b px-2" data-cmdk-input-wrapper="">
	<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	<CommandPrimitive.Input
		class={cn(
			"flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		{...$$restProps}
		bind:value
	/>
</div>
