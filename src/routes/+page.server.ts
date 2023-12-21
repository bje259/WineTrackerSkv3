import type { User } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = ({ locals }) => {
  return {
    user: locals.user as User,
  };
};
