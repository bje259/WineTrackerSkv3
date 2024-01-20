import type { User, Admin } from "$lib/types";
import { redirect } from "sveltekit-flash-message/server";
import type { LayoutServerLoad } from "./$types";
import { loadFlash } from "sveltekit-flash-message/server";

import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_USER_ID,
  USER_ADMIN_ID,
} from "$env/static/private";

export const load = loadFlash(async ({ locals }) => {
  console.log("Layout load", locals);
  if (
    (locals?.admin?.id || locals.pb.authStore.isAdmin) &&
    locals.pb.authStore.isValid
  ) {
    console.log("Layout Admin", locals.admin);
    const tempUser = await locals.pb
      .collection("users")
      .getOne<User>(ADMIN_USER_ID);
    console.log("Logged in as admin, setting user", tempUser, locals.admin);
    return {
      admin: locals.admin as Admin,
      user: locals?.user || tempUser, //  Replace with the appropriate values
    };
  }
  if (locals?.user?.id === ADMIN_USER_ID && locals.pb.authStore.isValid) {
    console.log("logged in as user, setting admin");
    await locals.pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    locals.admin = await locals.pb.admins.getOne<Admin>(USER_ADMIN_ID);
    console.log("Layout Admin", locals.admin);
    return {
      admin: locals.admin as Admin,
      user: locals?.user, //  Replace with the appropriate values
    };
  }
  if (locals?.user?.id) {
    console.log("Logged in as normal user, Layout User", locals.user);
    return {
      user: locals.user as User,
      admin: { id: "", email: "" }, //  Replace with the appropriate values
    };
  }

  console.log("Layout clearing user");
  return {
    user: { username: "", email: "" },
    admin: { id: "", email: "" }, //  Replace with the appropriate values
  };
});
