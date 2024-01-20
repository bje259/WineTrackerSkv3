import { redirect } from "@sveltejs/kit";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_USER_ID,
  USER_ADMIN_ID,
} from "$env/static/private";
import type { Admin, User } from "$lib/types";

export async function load({ locals, url }) {
  try {
    await locals.pb.collection("users").authRefresh();
  } catch (e) {
    locals.pb.authStore.clear();
    redirect(302, "/" + url.search);
  }

  if (
    (locals?.admin?.id || locals.pb.authStore.isAdmin) &&
    locals.pb.authStore.isValid
  ) {
    console.log("Layout Admin", locals.admin);
    const tempUser = await locals.pb
      .collection("users")
      .getOne<User>(ADMIN_USER_ID);
    console.log("Logged in as admin, setting user", tempUser, locals.admin);
    // return {
    //   admin: locals.admin as Admin,
    //   user: locals?.user || tempUser, //  Replace with the appropriate values
    // };
    redirect(302, "/" + url.search);
  }
  if (locals?.user?.id === ADMIN_USER_ID && locals.pb.authStore.isValid) {
    console.log("logged in as user, setting admin");
    await locals.pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    locals.admin = await locals.pb.admins.getOne<Admin>(USER_ADMIN_ID);
    console.log("Layout Admin", locals.admin);
    // return {
    //   admin: locals.admin as Admin,
    //   user: locals?.user, //  Replace with the appropriate values
    // };
    redirect(302, "/" + url.search);

    if (!locals.user || !locals.pb.authStore.isValid)
      redirect(302, "/" + url.search);
  }
}
