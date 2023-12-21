import type { User } from "$lib/types";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const DefaultUser: User = <User>{};

export const POST: RequestHandler = ({ locals }) => {
  console.log("logout server clearing user");
  locals.pb.authStore.clear();
  locals.user = DefaultUser;

  throw redirect(303, "/");
};
export const GET: RequestHandler = ({ locals }) => {
  console.log("logout server clearing user");
  locals.pb.authStore.clear();
  locals.user = DefaultUser;

  throw redirect(303, "/");
};
