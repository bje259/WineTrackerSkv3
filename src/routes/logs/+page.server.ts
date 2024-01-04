import { error, fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { bottleSchema } from "$lib/Schemas";
import { crudSchema } from "$lib/Schemas";
import { ClientResponseError } from "pocketbase";
import type { SuperValidated } from "sveltekit-superforms";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";
import { loginUserDto } from "../../lib/Schemas";

export const load = async ({ locals }) => {
  // READ bottle if paramID present
  let logs;
  try {
    if (locals.pb.authStore.isValid) {
      console.log(
        "🚀 ~ file: +page.server.ts:37 ~ load ~ locals.user:",
        locals.user
      );
      if (
        locals?.user?.id == "joy1yg8nrc1hrvz" ||
        locals?.admin?.id ||
        locals.pb.authStore.isAdmin
      ) {
        const authData = await locals.pb.admins.authWithPassword(
          ADMIN_EMAIL,
          ADMIN_PASSWORD
        );
        console.log("valid admin?: ", locals.pb.authStore.isValid);
      }
    } else {
      console.log(
        "🚀 ~ file: +page.server.ts:37 ~ load ~ Error locals:",
        locals.user
      );
      throw error(401, "Unauthorized");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log("🚀 ~ file: +page.server.ts:37 ~ load ~ e:", e);
    if (e.status === 401) throw redirect(303, "/login");
    else throw error(500, e);
  }

  try {
    //fetch bottlesDB from pocketbase and if bottle exists, return
    console.log("🚀 ~ file: +page.server.ts:37 ~ load ~ locals:", locals);
    logs = await locals.pb.health.check({});
    console.log("🚀 ~ file: +page.server.ts:37 ~ load ~ logs:", logs);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw error(500, e);
  }
  //return generated form from SuperForms and bottles from PB
  return { logs };
};
