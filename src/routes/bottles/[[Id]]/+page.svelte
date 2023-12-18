<script lang="ts">
	import EditBottle from '$lib/EditBottle.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	//import EditBottle from '$lib/EditBottle.svelte';
	//import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import * as Form from '$components/ui/form/';
	import { bottleSchema } from '$lib/BottlesDB';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';
	//import TestForm from './TestForm3.svelte';
	import { buttonVariants } from '$components/ui/button';
	import * as Popover from '$components/ui/popover';
	import FormSelectYear from '$lib/FormSelectYear.svelte';
	import { Calendar } from '$lib/components/ui/calendar/';
	import { cn } from '$lib/utils';
	import {
		CalendarDate,
		getLocalTimeZone,
		parseDate,
		today,
		type DateValue
	} from '@internationalized/date';
	import { CalendarIcon } from 'lucide-svelte';

	export let data: PageData;

	// const crudSchema = bottleSchema.extend({
	// 	Id: bottleSchema.shape.Id.optional()
	// });

	// const formData = superForm(data.form, {
	// 	validators: crudSchema,
	// 	taintedMessage: null,
	// 	resetForm: true
	// });

	// $: ({ form: theForm, delayed, message } = formData);

	// const df = new Intl.DateTimeFormat('en-US', {
	// 	year: 'numeric',
	// 	month: '2-digit',
	// 	day: '2-digit'
	// });

	// $: value1 = $theForm?.Purchased ? parseDate($theForm.Purchased) : undefined;
	// $: value2 = $theForm?.Consumed ? parseDate($theForm.Consumed) : undefined;

	// let placeholder: DateValue = today(getLocalTimeZone());
</script>

<!-- Start header-->
<!-- <div class="container h-full mx-auto flex justify-center">
	<div class="px-4 text-center flex flex-col items-center">
		<h1 class="h1">Wine Tracker!</h1>
		{#if $message}
			<h3 class:invalid={$page.status >= 400}>{$message}</h3>
		{/if}

		<h3>Bottles</h3>
		<div class="bottles">
			{#each data.bottles as bottle}
				<a href="/bottles/{bottle.Id}">{bottle.Name}</a>
			{/each}
			{#if $theForm.Id}
				<form action="/bottles">
					<button>Create new</button>
				</form>
			{/if}
		</div>
		<div class="flex text-start">
			{#if $page.data.debug}<SuperDebug data={$theForm} collapsible />{/if}
		</div>

		<h2>{!$theForm.Id ? 'Create' : 'Update'} user</h2> -->

		<!-- form Code starts here-->

		<EditBottle data={data.form} bottles={data.bottles} />

		<!-- <div class="flex items-center justify-between">
			<Form.Root
				form={formData}
				controlled={true}
				schema={crudSchema}
				class="space-y-2"
				let:config
				debug={true}
				let:enhance
				asChild
			>
				<form method="POST" use:enhance>
					<input type="hidden" name="Id" bind:value={$theForm.Id} />

					<Form.Field {config} name="Name">
						<div class="flex">
							<Form.Label class="p-0.5">Wine Name</Form.Label>
							<Form.Validation class="ml-8" />
						</div>
						<Form.Input />
						<Form.Description>The name of this wine bottle.</Form.Description>
					</Form.Field>

					<Form.Field {config} name="Producer">
						<div class="flex">
							<Form.Label class="p-0.5">Producer</Form.Label>
							<Form.Validation class="ml-8" />
						</div>
						<Form.Input />
						<Form.Description>The producer of this wine bottle.</Form.Description>
					</Form.Field>
					<Form.Field {config} name="Vintage">
						<div class="flex">
							<Form.Label class="p-0.5">Vintage</Form.Label>
							<Form.Validation class="ml-8" />
						</div>
						<FormSelectYear />
						<Form.Description>The vintage of this wine bottle.</Form.Description>
					</Form.Field>
					<Form.Field {config} name="Purchased">
						<Form.Label>Purchased Date</Form.Label>
						<Popover.Root>
							<Form.Control id="purchased" let:attrs>
								<Popover.Trigger
									id="purchased"
									{...attrs}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-[280px] justify-start pl-4 text-left font-normal',
										!value1 && 'text-muted-foreground'
									)}
								>
									{value1 ? df.format(value1.toDate(getLocalTimeZone())) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
							</Form.Control>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									bind:value={value1}
									bind:placeholder
									minValue={new CalendarDate(1900, 1, 1)}
									maxValue={today(getLocalTimeZone())}
									calendarLabel="Purchased Date"
									initialFocus
									onValueChange={(v) => {
										if (v) {
											$theForm.Purchased = v.toString();
										} else {
											$theForm.Purchased = new CalendarDate(1900, 1, 1).toString();
										}
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<Form.Description>The date this wine bottle was purchased.</Form.Description>
						<Form.Validation />
					</Form.Field>
					<Form.Field {config} name="Consumed">
						<Form.Label>Consumed Date</Form.Label>
						<Popover.Root>
							<Form.Control id="consumed" let:attrs>
								<Popover.Trigger
									id="consumed"
									{...attrs}
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-[280px] justify-start pl-4 text-left font-normal',
										!value2 && 'text-muted-foreground'
									)}
								>
									{value2 ? df.format(value2.toDate(getLocalTimeZone())) : 'Pick a date'}
									<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
								</Popover.Trigger>
							</Form.Control>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									bind:value={value2}
									bind:placeholder
									minValue={new CalendarDate(1900, 1, 1)}
									maxValue={today(getLocalTimeZone())}
									calendarLabel="Consumed Date"
									initialFocus
									onValueChange={(v) => {
										if (v) {
											$theForm.Purchased = v.toString();
										} else {
											$theForm.Purchased = new CalendarDate(1900, 1, 1).toString();
										}
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<Form.Description>The date this wine bottle was consumed.</Form.Description>
						<Form.Validation />
					</Form.Field>

					<Form.Button class="variant-filled-surface btn">Submit</Form.Button>
					{#if $delayed}Working...{/if}
					{#if $theForm.Id}
						<Form.Button
							name="delete"
							on:click={(e) => !confirm('Are you sure?') && e.preventDefault()}
							class="danger">Delete Bottle</Form.Button
						>
					{/if}
				</form>
			</Form.Root>
		</div> -->

		<!-- Form code ends here-->
	<!-- </div>
</div> -->

<!-- <style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1em;
		align-items: flex-start;
		margin-bottom: 2em;
	}

	.bottles {
		columns: 1 150px;
	}

	.bottles > * {
		display: block;
		white-space: nowrap;
		overflow-x: hidden;
	}
</style> -->
