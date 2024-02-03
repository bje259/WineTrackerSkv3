/* eslint-disable @typescript-eslint/no-unused-vars */
import { error, fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "./$types.d.ts";
import { completionSchema } from "$lib/Schemas";
import { ClientResponseError } from "pocketbase";

export const load: PageServerLoad = async () => {
  const form = await superValidate(completionSchema);
  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await superValidate(request, completionSchema);

    if (!formData.valid) {
      return fail(400, { form: formData, errors: formData.errors?._errors });
    }

    return message(formData, "success");
  },
};
