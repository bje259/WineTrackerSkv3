import type { PageServerLoad } from "./$types";
import {
  importSchema,
  importSchemaArray,
  bottleRecordSchema,
} from "$lib/Schemas";
import type { User } from "$lib/types";
import type PocketBase from "pocketbase";
import { message, superValidate } from "sveltekit-superforms/server";
import { bottleSchema, crudSchema } from "$lib/Schemas";
import { z } from "zod";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Import } from "lucide-svelte";
import type { ClientResponseError } from "pocketbase";
type BottleRecordSchema = z.infer<typeof bottleRecordSchema>;
type BottleRecordsSchema = BottleRecordSchema[];

export const load = (async ({ locals }) => {
  let bottlesDB: BottleRecordsSchema = [];
  //const exportFormData: ExportSchema;
  if (locals.user && locals.pb.authStore.isValid) {
    bottlesDB = await locals.pb
      .collection("BottlesDB")
      .getFullList<BottleRecordSchema>({
        sort: "Name",
      });
  } else {
    throw redirect(303, "/login");
  }

  //const form = await superValidate(importSchemaArray);

  return { bottlesDB, user: locals.user };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals }) => {
    // //console.log("🚀 ~ file: +page.server.ts:39 ~ default: ~ request:", request);

    const formData = await request.formData();
    const form = await superValidate(formData, crudSchema);
    // console.log("🚀 ~ file: +page.server.ts:43 ~ default: ~ form:", form);

    if (!form.valid) {
      return fail(400, {
        data: form,
        message: "Invalid form",
        errors: form.errors?._errors,
      });
    }

    if (!locals.pb.authStore.isValid) throw redirect(303, "/login");
    const bottle = form.data;
    if (!bottle.id) {
      // const bottle = { ...form.data, id: bottleId() };
      //bottles.push(bottle);
      //fix UserID if missing
      if (!bottle.UserId && locals.user) {
        bottle.UserId = locals.user.id!;
        // console.log(
        // "🚀 ~ file: +page.server.ts:61 ~ default: ~ bottle.UserId:",
        // bottle.UserId
        // );
      }

      try {
        console.log("creating bottle: ", bottle);
        await locals.pb.collection("BottlesDB").create(bottle);
        // console.log(
        // "🚀 ~ file: +page.server.ts:69 ~ default: ~ bottle:",
        // bottle
        // );
      } catch (err) {
        const e = err as ClientResponseError;
        // console.log("🚀 ~ file: +page.server.ts:72 ~ default: ~ e:", e);

        throw error(501, e);
      }
      //throw redirect(303, "/bottles");
      return message(form, "bottle created!");
    } else {
      // const index = bottles.findIndex((u) => u.id == form.data.id);
      // if (index == -1) throw error(404, "bottle not found.");

      if (formData.has("delete")) {
        // bottles.splice(index, 1);
        try {
          console.log("deleting bottle: ", bottle);
          await locals.pb.collection("BottlesDB").delete(bottle.id);
        } catch (err) {
          const e = err as ClientResponseError;
          // console.log("🚀 ~ file: +page.server.ts:88 ~ default: ~ e:", e);

          throw error(501, e);
        }
        const blankForm = await superValidate(crudSchema);
        return message(blankForm, {
          message: "bottle deleted!",
          deletedBottle: bottle.id,
        });
      } else {
        // bottles[index] = { ...form.data, id: form.data.id };
        try {
          console.log("updating bottle: ", bottle);
          await locals.pb.collection("BottlesDB").update(bottle.id, bottle);
        } catch (err) {
          const e = err as ClientResponseError;
          // console.log("🚀 ~ file: +page.server.ts:100 ~ default: ~ e:", e);

          throw error(501, e);
        }
        //throw redirect(303, "/bottles");
        return message(form, "bottle updated!");
      }
    }

    return { form };
  },
};
