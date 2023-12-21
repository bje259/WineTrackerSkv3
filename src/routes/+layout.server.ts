import type { User } from "$lib/types";
import type Admin from "pocketbase";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
  if (locals.user) {
    console.log("Layout User", locals.user);
    return {
      user: locals.user as User,
    };
  }

  console.log("Layout clearing user");
  return {
    user: undefined,
  };
};
