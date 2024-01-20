import type { PageServerLoad } from "./$types";
import { importSchema, importSchemaArray } from "$lib/Schemas";
import type { User } from "$lib/types";
import type PocketBase from "pocketbase";
import { message, superValidate } from "sveltekit-superforms/server";
import { bottleSchema, crudSchema } from "$lib/Schemas";
import { z } from "zod";
import { error, fail } from "@sveltejs/kit";
import type { Import } from "lucide-svelte";
import type { ClientResponseError } from "pocketbase";
import { setFlash } from "sveltekit-flash-message/server";
import { redirect } from "sveltekit-flash-message/server";
type BottleDB = z.infer<typeof crudSchema>;
type BottlesDB = BottleDB[];
type ImportSchema = z.infer<typeof importSchema>;
type ImportBottleDB = z.infer<typeof crudSchema>;

export const load = (async ({ locals }) => {
  let bottlesDB: BottlesDB = [];
  //const exportFormData: ExportSchema;
  if (locals.user && locals.pb.authStore.isValid) {
    bottlesDB = await locals.pb.collection("BottlesDB").getFullList<BottleDB>({
      sort: "Name",
    });
  } else {
    throw redirect(303, "/login");
  }

  const form = await superValidate(importSchemaArray);

  return { form, bottlesDB, user: locals.user };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals, cookies }) => {
    //console.log("🚀 ~ file: +page.server.ts:39 ~ default: ~ request:", request);

    const formData: FormData = await request.formData();
    console.log(
      "🚀 ~ file: +page.server.ts:36 ~ default: ~ formData:",
      formData
    );
    const form = await superValidate(formData, importSchemaArray);
    console.log("🚀 ~ file: +page.server.ts:38 ~ default: ~ form:", form);

    if (!form.valid) {
      setFlash({ type: "error", message: "Invalid Form" }, cookies);
      return fail(400, {
        data: form,
        message: "Invalid form",
        errors: form.errors?._errors,
      });
    }

    let bottlesDB: BottlesDB = [];
    //const exportFormData: ExportSchema;
    if (locals.user && locals.pb.authStore.isValid) {
      bottlesDB = await locals.pb
        .collection("BottlesDB")
        .getFullList<BottleDB>({
          sort: "Name",
        });
      console.log(
        "🚀 ~ file: +page.server.ts:57 ~ default: ~ bottlesDB:",
        bottlesDB
      );
    } else {
      throw redirect(303, "/login");
    }

    const parsed = form.data.importArray;
    console.log("🚀 ~ file: +page.server.ts:63 ~ default: ~ parsed:", parsed);

    //loop through parsed array and if botttle exists, update, else create

    try {
      parsed.forEach(async (bottle) => {
        const bottleExists = bottlesDB.find((b) => b.id === bottle.id);
        if (bottleExists) {
          console.log("bottleExists", bottleExists);
          //update bottle
          await locals.pb
            .collection("BottlesDB")
            .update(bottle.id!, bottle, { requestKey: null });
        } else {
          //create bottle
          await locals.pb
            .collection("BottlesDB")
            .create(bottle, { requestKey: null });
          console.log(
            "🚀 ~ file: +page.server.ts:77 ~ parsed.forEach Create!!~ bottle:",
            bottle
          );
        }
      });
    } catch (err) {
      const e = err as ClientResponseError;
      console.log("🚀 ~ file: +page.server.ts:100 ~ default: ~ e:", e);
      setFlash({ type: "error", message: "Error in processing" }, cookies);
      throw error(501, e);
    }

    //loop through bottlesDB and if bottle does not exist in parsed array, delete
    try {
      bottlesDB.forEach(async (bottle) => {
        const bottleExists = parsed.find((b) => b.id === bottle.id);
        if (!bottleExists) {
          console.log("bottleExists false, deleting", bottleExists);
          //delete bottle
          await locals.pb
            .collection("BottlesDB")
            .delete(bottle.id!, { requestKey: null });
        }
      });
    } catch (err) {
      const e = err as ClientResponseError;
      console.log("🚀 ~ file: +page.server.ts:100 ~ default: ~ e:", e);
      setFlash({ type: "error", message: "Error" }, cookies);
      throw error(501, e);
    }
    console.log("🚀 ~ file: +page.server.ts:106 ~ default: ~ form:", form);
    return message(form, "Imported!");
  },
};
