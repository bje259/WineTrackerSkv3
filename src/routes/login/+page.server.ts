/* eslint-disable @typescript-eslint/no-unused-vars */
import { error, fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "./$types";
import { loginUserDto } from "$lib/Schemas";
import { ClientResponseError } from "pocketbase";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.pb.authStore.isValid) {
    console.log("already logged in");
    throw redirect(303, "/");
  }
  const form = await superValidate(loginUserDto);
  return { form };
};

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const formData = await superValidate(request, loginUserDto);

    if (!formData.valid) {
      return fail(400, { form: formData, errors: formData.errors?._errors });
    }

    try {
      await locals.pb
        .collection("users")
        .authWithPassword(
          formData.data.usernameOrEmail,
          formData.data.password
        );
      console.log(locals.pb.authStore.isValid);
      console.log(locals.pb.authStore.token);
      console.log("Username", locals.pb.authStore?.model?.username);
      console.log("Email", locals.pb.authStore?.model?.email);
      console.log("Verified", locals.pb.authStore?.model?.verified);
      console.log("Id", locals.pb.authStore?.model?.id);
      if (!locals.pb?.authStore?.model?.verified) {
        console.log("clearing auth store");
        locals.pb.authStore.clear();
        return {
          notVerified: true,
        };
      }
    } catch (err) {
      console.log("Error: ", err);
      const e = err as ClientResponseError;

      const { password, ...rest } = formData.data;

      return {
        data: rest,
        invalidCredentials: true,
      };
    }
    throw redirect(303, "/");

    return message(formData, "Logged in!");
  },
};
