import type { User, Admin } from "$lib/types";
import { redirect } from "sveltekit-flash-message/server";
import type { LayoutServerLoad } from "./$types";
import { loadFlash } from "sveltekit-flash-message/server";
// import dotenv from "dotenv";
import { createContext } from "$lib/trpc/context";
import { router, createCallerFactory } from "$lib/trpc/router";
// dotenv.config();
import { PO } from "$lib/utils";

import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_USER_ID,
  USER_ADMIN_ID,
} from "$env/static/private";

export const load = loadFlash(async ({ locals }) => {
  // const { pb, admin, user, userId } = await createContext(event);
  // const locals = { pb, admin, user };
  // event.locals = locals;
  const log = locals.log || new PO();
  log.p("Layout load", locals);
  if (
    (locals?.admin?.id || locals?.pb?.authStore?.isAdmin) &&
    locals?.pb?.authStore?.isValid
  ) {
    log.p("Layout Admin", locals.admin);
    const tempUser = await locals.pb
      .collection("users")
      .getOne<User>(ADMIN_USER_ID);
    log.p("Logged in as admin, setting user", tempUser, locals.admin);
    return {
      admin: locals.admin as Admin,
      user: locals.user || tempUser, //  Replace with the appropriate values
    };
  }
  if (locals?.user?.id === ADMIN_USER_ID && locals?.pb?.authStore?.isValid) {
    log.p("logged in as user, setting admin");
    await locals.pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    locals.admin = await locals.pb.admins.getOne<Admin>(USER_ADMIN_ID);
    log.p("Layout Admin", locals.admin);
    return {
      admin: locals.admin as Admin,
      user: locals?.user, //  Replace with the appropriate values
    };
  }
  if (locals?.user?.id) {
    log.p("Logged in as normal user, Layout User", locals.user);
    return {
      user: locals.user as User,
      admin: { id: "", email: "" }, //  Replace with the appropriate values
    };
  }

  log.p("Layout clearing user");
  return {
    user: { username: "", email: "" },
    admin: { id: "", email: "" }, //  Replace with the appropriate values
  };
});
