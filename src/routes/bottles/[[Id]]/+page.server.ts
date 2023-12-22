/* eslint-disable @typescript-eslint/no-unused-vars */

import { error, fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { bottleId, bottles } from "$lib/BottlesDB";
import { bottleSchema } from "$lib/Schemas";
import { crudSchema } from "$lib/Schemas";
import { ClientResponseError } from "pocketbase";

type BottleDB = z.infer<typeof crudSchema>;
type BottlesDB = BottleDB[];

export const load = async ({ params, locals }) => {
  // READ bottle
  const id = params.Id;
  let bottlesDB: BottlesDB;
  if (locals.pb.authStore.isValid) {
    bottlesDB = await locals.pb.collection("BottlesDB").getFullList<BottleDB>({
      sort: "Name",
    });
  } else {
    throw redirect(303, "/login");
  }
  const bottle = id ? bottlesDB.find((b) => b.id === id) : null;

  if (id && !bottle) throw error(404, "Bottle not found.");

  const form = await superValidate(bottle, crudSchema);

  return { form, bottlesDB };
};

export const actions = {
  default: async ({ request, locals }) => {
    //console.log("🚀 ~ file: +page.server.ts:39 ~ default: ~ request:", request);

    const formData = await request.formData();
    const form = await superValidate(formData, crudSchema);
    console.log("🚀 ~ file: +page.server.ts:43 ~ default: ~ form:", form);

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
      if (!bottle.UserId) {
        bottle.UserId = locals.user.id!;
        console.log(
          "🚀 ~ file: +page.server.ts:61 ~ default: ~ bottle.UserId:",
          bottle.UserId
        );
      }

      try {
        console.log("creating bottle: ", bottle);
        await locals.pb.collection("BottlesDB").create(bottle);
        console.log(
          "🚀 ~ file: +page.server.ts:69 ~ default: ~ bottle:",
          bottle
        );
      } catch (err) {
        const e = err as ClientResponseError;
        console.log("🚀 ~ file: +page.server.ts:72 ~ default: ~ e:", e);

        throw error(501, e);
      }
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
          console.log("🚀 ~ file: +page.server.ts:88 ~ default: ~ e:", e);

          throw error(501, e);
        }
        throw redirect(303, "/bottles");
      } else {
        // bottles[index] = { ...form.data, id: form.data.id };
        try {
          console.log("updating bottle: ", bottle);
          await locals.pb.collection("BottlesDB").update(bottle.id, bottle);
        } catch (err) {
          const e = err as ClientResponseError;
          console.log("🚀 ~ file: +page.server.ts:100 ~ default: ~ e:", e);

          throw error(501, e);
        }

        return message(form, "bottle updated!");
      }
    }

    return { form };
  },
};
