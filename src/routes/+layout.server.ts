import type { User, Admin } from "$lib/types";

import type { LayoutServerLoad } from "./$types";

import { ADMIN_USER_ID } from "$env/static/private";

export const load: LayoutServerLoad = async ({ locals }) => {
  console.log("Layout load", locals);
  if (
    (locals?.admin?.id ||
      locals.pb.authStore.isAdmin ||
      locals?.user?.id === ADMIN_USER_ID) &&
    locals.pb.authStore.isValid
  ) {
    console.log("Layout Admin", locals.admin);
    const tempUser = await locals.pb
      .collection("users")
      .getOne<User>(ADMIN_USER_ID);
    return {
      admin: locals.admin as Admin,
      user: locals?.user || tempUser, //  Replace with the appropriate values
    };
  }

  if (locals?.user?.id) {
    console.log("Layout User", locals.user);
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
};
