/* eslint-disable @typescript-eslint/no-unused-vars */
import { error, fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "./$types";
import { loginUserDto } from "$lib/Schemas";
import { ClientResponseError } from "pocketbase";
const validAuthProviders = ["google"];
import type { PageData } from "./$types";
import type { Admin } from "$lib/types";
import { setFlash } from "sveltekit-flash-message/server";
import { redirect } from "sveltekit-flash-message/server";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_USER_ID,
  USER_ADMIN_ID,
} from "$env/static/private";
import { z } from "zod";
import { UsersRecordSchema } from "$lib/WineTypes.js";
process.env.ADMIN_EMAIL = ADMIN_EMAIL;
process.env.ADMIN_PASSWORD = ADMIN_PASSWORD;
export const load = async ({ locals, parent, cookies }) => {
  if (locals.pb.authStore.isValid) {
    console.log("already logged in");
    const message = {
      type: "success",
      message: "Already logged in!",
    } as const;
    throw redirect(303, "/", message, cookies);
  }
  const { admin, user } = await parent();
  const form = await superValidate(loginUserDto);
  return { admin, user, form, validAuthProviders };
};

export const actions: Actions = {
  login: async ({ request, locals, cookies }) => {
    const formData = await superValidate(request, loginUserDto);

    if (!formData.valid) {
      console.log(
        "🚀 ~ file: +page.server.ts:22 ~ login: ~ Not vali formData.valid:",
        formData
      );
      setFlash({ type: "error", message: "Login failed" }, cookies);
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
      // if (!locals.pb?.authStore?.model?.verified) {
      //   console.log("clearing auth store - failed authwpwd");
      //   locals.pb.authStore.clear();
      //   throw new Error("Not Verified");
      // }
      if (locals.user?.id === ADMIN_USER_ID && locals.pb.authStore.isValid) {
        console.log("logged in as user, setting admin");
        await locals.pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        locals.admin = await locals.pb.admins.getOne<Admin>(USER_ADMIN_ID);
        console.log("Layout Admin", locals.admin);
        const message = {
          type: "success",
          message: "Logged in as admin",
        } as const;
        redirect(303, "/", message, cookies);
      }
      if (locals.pb.authStore.isValid) {
        const tempuser = UsersRecordSchema.parse({
          username: locals.pb.authStore?.model?.username,
          email: locals.pb.authStore?.model?.email,
          id: locals.pb.authStore?.model?.id,
          name: locals.pb.authStore?.model?.name,
          verified: locals.pb.authStore?.model?.verified,
          created: locals.pb.authStore?.model?.created,
          updated: locals.pb.authStore?.model?.updated,
          emailVisibility: locals.pb.authStore?.model?.emailVisibility,
          avatar: locals.pb.authStore?.model?.avatar,
          UserRoles: locals.pb.authStore?.model?.UserRoles,
        });
        locals.user = tempuser;
      }
    } catch (err) {
      console.log("Error at catch bottom login: ", err);
      const e = err as ClientResponseError;
      console.log("formdata at error", formData);
      const {
        data: { password, ...dataRest },
        ...rest
      } = formData;

      const reconstructedFormData = { ...rest, data: dataRest };
      reconstructedFormData?.errors?._errors?.push("Invalid Credentials");
      setFlash({ type: "error", message: "Login failed" }, cookies);
      return {
        form: reconstructedFormData,
        invalidCredentials: true,
      };
    }
    const message = {
      type: "success",
      message: "Logged In successfully!",
    } as const;
    throw redirect(303, "/", message, cookies);
  },
};
