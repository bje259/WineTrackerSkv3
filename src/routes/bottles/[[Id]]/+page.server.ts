/* eslint-disable @typescript-eslint/no-unused-vars */

import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

import { bottleId, bottleSchema, bottles } from '$lib/BottlesDB';

const crudSchema = bottleSchema.extend({
	Id: bottleSchema.shape.Id.optional()
});

export const load = async ({ params }) => {
	// READ bottle
	const Id = params.Id;
	const bottle = Id ? bottles.find((u) => u.Id == Id) : null;

	if (Id && !bottle) throw error(404, 'Bottle not found.');

	const form = await superValidate(bottle, crudSchema);
	const debug = true;
	return { form, bottles, debug };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, crudSchema);
		if (formData.has('delay')) {
			await new Promise((r) => setTimeout(r, 2000));
		}

		if (!form.valid) return fail(400, { form });

		if (!form.data.Id) {
			const bottle = { ...form.data, Id: bottleId() };
			bottles.push(bottle);

			return message(form, 'bottle created!');
		} else {
			const index = bottles.findIndex((u) => u.Id == form.data.Id);
			if (index == -1) throw error(404, 'bottle not found.');

			if (formData.has('delete')) {
				bottles.splice(index, 1);
				throw redirect(303, '/bottles');
			} else {
				bottles[index] = { ...form.data, Id: form.data.Id };
				return message(form, 'bottle updated!');
			}
		}

		return { form };
	}
};
