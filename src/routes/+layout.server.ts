import type { User, Admin } from "$lib/types";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (
    (locals?.admin?.id || locals.pb.authStore.isAdmin) &&
    locals.pb.authStore.isValid
  ) {
    console.log("Layout Admin", locals.admin);
    return {
      admin: locals.admin as Admin,
      user: locals?.user || { username: "", email: "" }, //  Replace with the appropriate values
    };
  }

  if (locals?.user?.id) {
    console.log("Layout User", locals.user);
    return {
      user: locals.user as User,
      admin: { username: "", email: "" }, //  Replace with the appropriate values
    };
  }

  console.log("Layout clearing user");
  return {
    user: { username: "", email: "" },
    admin: { username: "", email: "" }, //  Replace with the appropriate values
  };
};
