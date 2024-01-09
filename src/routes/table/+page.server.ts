import type { PageServerLoad } from "./$types";
import {
  importSchema,
  importSchemaArray,
  bottleRecordSchema,
} from "$lib/Schemas";
import type {
  BottleRecordSchema,
  BottleRecordsSchema,
  BottleRecordsTableSchema,
  BottleRecordTableSchema,
  User,
} from "$lib/types";
import type PocketBase from "pocketbase";
import { message, superValidate } from "sveltekit-superforms/server";
import { bottleSchema, crudSchema } from "$lib/Schemas";
import { z } from "zod";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Import } from "lucide-svelte";
import type { ClientResponseError } from "pocketbase";
import { isRequestOptions } from "openai/core.mjs";

export const load = (async ({ locals }) => {
  let bottlesDB: BottleRecordsSchema = [];
  //const exportFormData: ExportSchema;
  if (locals.user && locals.pb.authStore.isValid) {
    bottlesDB = await locals.pb
      .collection("BottlesDB")
      .getFullList<BottleRecordSchema>({
        sort: "id",
      });
  } else {
    throw redirect(303, "/login");
  }

  //const form = await superValidate(importSchemaArray);

  return { bottlesDB, user: locals.user };
}) satisfies PageServerLoad;

export const actions = {
  deleteSet: async ({ request, locals }) => {
    const data = await request.formData();
    if (locals?.user?.id && locals.pb.authStore.isValid) {
      const selectedBottlesData = data.get("selectedBottles");
      if (selectedBottlesData && typeof selectedBottlesData === "string") {
        const selectedBottles = JSON.parse(
          selectedBottlesData
        ) as BottleRecordsTableSchema;

        //convert BottleRecordsTableSchema to BottleRecordsSchema
        const bottlesDB = selectedBottles.map((b) => {
          const User = locals.user!;
          const UserId = User.id!;
          const bottle: BottleRecordSchema = {
            Name: b.Name,
            Producer: b.Producer,
            Vintage: b.Vintage,
            created: b.created,
            updated: b.updated,
            id: b.BottleId,
            UserId: UserId,
            Purchased: b.Purchased,
            Consumed: b.Consumed,
          };
          return bottle;
        });

        for (const bottle of bottlesDB) {
          try {
            console.log("deleting bottle: ", bottle);
            await locals.pb.collection("BottlesDB").delete(bottle.id);
          } catch (err) {
            const e = err as ClientResponseError;
            console.log("🚀 ~ file: +page.server.ts:88 ~ default: ~ e:", e);

            throw error(501, e);
          }
        }
      } else {
        throw error(501, "Incorrect format");
      }
    }
    return {};
  },
};
