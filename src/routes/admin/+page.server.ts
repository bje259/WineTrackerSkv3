import { error, fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "./$types";
import { adminToolsSchema } from "$lib/Schemas";
import { ClientResponseError } from "pocketbase";
const validAuthProviders = ["google"];
import type { PageData } from "../$types";
import type { Admin } from "$lib/types";
import { setFlash } from "sveltekit-flash-message/server";
import { redirect } from "sveltekit-flash-message/server";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_USER_ID,
  USER_ADMIN_ID,
} from "$env/static/private";

export const load = (async ({ locals, cookies, parent }) => {
  const { admin, user } = await parent();
  if (!locals.pb.authStore.isValid) {
    console.log("Not logged in");
    const message = {
      type: "error",
      message: "You must be logged in to access this page",
    } as const;
    throw redirect(303, "/login", message, cookies);
  }
  if (!locals.pb.authStore.isAdmin && !locals.admin?.id) {
    console.log("Not admin");
    const message = {
      type: "error",
      message: "You must be an admin to access this page",
    } as const;
    throw redirect(303, "/", message, cookies);
  }

  const form = await superValidate(adminToolsSchema);

  return { admin, user, form };
}) satisfies PageServerLoad;
