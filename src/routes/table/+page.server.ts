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
type BottleDB = z.infer<typeof bottleRecordSchema>;
type BottlesDB = BottleDB[];

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

  //const form = await superValidate(importSchemaArray);

  return { bottlesDB, user: locals.user };
}) satisfies PageServerLoad;
