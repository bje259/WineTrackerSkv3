import { message, superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad } from "./$types";
import { z } from "zod";
import { error, fail } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { redirect } from "sveltekit-flash-message/server";
import { resetPassSchema } from "$lib/Schemas";
export interface ResetPasswordBody {
  email: string;
}

export const load = (async ({ locals, cookies }) => {
  const form = await superValidate(resetPassSchema);

  return { form, user: locals.user, admin: locals.admin };
}) satisfies PageServerLoad;

export const actions = {
  async default({ locals, request }) {
    const bodyRaw = Object.fromEntries(await request.formData()) as unknown;
    const body = bodyRaw as ResetPasswordBody;

    try {
      await locals.pb.collection("users").requestPasswordReset(body.email);
      return { message: "An email has been sent to reset your password!" };
    } catch (e: unknown) {
      console.error("Error:", e);
      const catachable = e as Error;
      return { errorMessage: catachable.message };
    }
  },
};
