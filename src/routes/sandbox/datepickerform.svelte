<script lang="ts" context="module">
	import { z } from 'zod';

	export const formSchema = z.object({
		dob: z.string().refine((v) => v, { message: 'A date of birth is required.' })
	});

	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		today,
		type DateValue
	} from '@internationalized/date';
	import { Calendar as CalendarIcon } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form: SuperValidated<FormSchema> = $page.data.datePicker;

	const theForm = superForm(form, {
		validators: formSchema,
		taintedMessage: null
	});

	const { form: formStore } = theForm;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let placeholder: DateValue = (new CalendarDate(1900,1,1));
	let value: DateValue | undefined = $formStore.dob ? parseDate($formStore.dob) : placeholder;
</script>

<Form.Root
	schema={formSchema}
	controlled
	form={theForm}
	let:config
	action="?/datePicker"
	class="space-y-8"
>
	<Form.Field {config} name="dob">
		<Form.Item class="flex flex-col">
			<Form.Label for="dob">Date of birth</Form.Label>
			<Popover.Root>
				<Form.Control id="dob" let:attrs>
					<Popover.Trigger
						id="dob"
						{...attrs}
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'w-[280px] pl-4 justify-start text-left font-normal',
							!value && 'text-muted-foreground'
						)}
					>
						{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
						<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
					</Popover.Trigger>
				</Form.Control>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						bind:value
						bind:placeholder
						minValue={new CalendarDate(1900, 1, 1)}
						maxValue={today(getLocalTimeZone())}
						calendarLabel="Date of birth"
						initialFocus
						onValueChange={(v) => {
							if (v) {
								$formStore.dob = v.toString();
							} else {
								$formStore.dob = '';
							}
						}}
					/>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Your date of birth is used to calculator your age</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Button type="submit">Submit</Button>
</Form.Root>
