<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	//import EditBottle from '$lib/EditBottle.svelte';
	//import { superForm } from 'sveltekit-superforms/client';
	import { page } from '$app/stores';
	import * as Form from '$components/ui/form/';
	import { bottleSchema } from '$lib/BottlesDB';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';
	//import TestForm from './TestForm3.svelte';
	import { getLocalTimeZone, parseDate, today, type DateValue } from '@internationalized/date';

	export let data: PageData;

	const crudSchema = bottleSchema.extend({
		Id: bottleSchema.shape.Id.optional()
	});

	// Client API:
	// const { form } = superForm(data.form);

	// const { form, errors, constraints, enhance, delayed, message } = superForm(data.form, {
	// 		resetForm: true
	// 	});

	$: formData = superForm(data.form, {
		validators: crudSchema,
		taintedMessage: null,
		resetForm: true
	});

	$: ({ form: theForm, delayed, message, enhance, errors, constraints } = formData);

	const df = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	$: value1 = $theForm?.Purchased ? parseDate($theForm.Purchased) : undefined;
	$: value2 = $theForm?.Consumed ? parseDate($theForm.Consumed) : undefined;

	let placeholder: DateValue = today(getLocalTimeZone());
</script>

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

<SuperDebug data={$theForm} collapsible />

<h2>{!$theForm.Id ? 'Create' : 'Update'} user</h2>

<!-- form Code starts here-->

<div class="flex items-center justify-between">
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
			<label>
				Vintage<br />
				<input
					name="Vintage"
					type="Vintage"
					aria-invalid={$errors.Vintage ? 'true' : undefined}
					bind:value={$theForm.Vintage}
					{...$constraints.Vintage}
				/>
				{#if $errors.Vintage}<span class="invalid">{$errors.Vintage}</span>{/if}
			</label>
			<label>
				Purchased<br />
				<input
					name="Purchased"
					type="Purchased"
					aria-invalid={$errors.Purchased ? 'true' : undefined}
					bind:value={$theForm.Purchased}
					{...$constraints.Purchased}
				/>
				{#if $errors.Purchased}<span class="invalid">{$errors.Purchased}</span>{/if}
			</label>
			<label>
				Consumed<br />
				<input
					name="Consumed"
					type="Consumed"
					aria-invalid={$errors.Consumed ? 'true' : undefined}
					bind:value={$theForm.Consumed}
					{...$constraints.Consumed}
				/>
				{#if $errors.Consumed}<span class="invalid">{$errors.Consumed}</span>{/if}
			</label>

			<button>Submit</button>
			{#if $delayed}Working...{/if}
			{#if $theForm.Id}
				<button
					name="delete"
					on:click={(e) => !confirm('Are you sure?') && e.preventDefault()}
					class="danger">Delete user</button
				>
			{/if}
			<!-- New end tags below-->
		</form>
	</Form.Root>
</div>

<style>
	.bottles {
		columns: 1 150px;
	}

	.bottles > * {
		display: block;
		white-space: nowrap;
		overflow-x: hidden;
	}
</style>
