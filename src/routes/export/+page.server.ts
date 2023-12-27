import type { PageServerLoad } from "./$types";
import { exportSchema } from "$lib/Schemas";
import type { User } from "$lib/types";
import type PocketBase from "pocketbase";
import { message, superValidate } from "sveltekit-superforms/server";
import { bottleSchema } from "$lib/Schemas";
import { z } from "zod";
import { redirect } from "@sveltejs/kit";
type BottleDB = z.infer<typeof bottleSchema>;
type BottlesDB = BottleDB[];
type ExportSchema = z.infer<typeof exportSchema>;

function arrayToCSV(data: BottlesDB) {
  if (!data.length) return "";

  // Extract headers
  const headers = Object.keys(data[0]) as (keyof BottleDB)[];

  // Create header row
  const headerRow = headers.join(",");

  // Create data rows
  const dataRows = data.map((row) => {
    return headers
      .map((fieldName) => {
        let value = row[fieldName];
        // Escape double quotes with another double quote
        if (typeof value === "string" && value.includes('"')) {
          value = value.replace(/"/g, '""');
        }
        // Wrap with double quotes if value contains a comma, newline, or double quote
        if (value && typeof value === "string" && /,|\n|"/.test(value)) {
          value = `"${value}"`;
        }
        return value;
      })
      .join(",");
  });

  // Combine rows with newline
  return [headerRow, ...dataRows].join("\n");
}

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
  const exportString = arrayToCSV(bottlesDB);
  const exportFormData: ExportSchema = {
    exportString: exportString,
    UserId: locals.user.id!,
  };
  const form = await superValidate(exportFormData, exportSchema);
  return { form, bottlesDB, user: locals.user };
}) satisfies PageServerLoad;
