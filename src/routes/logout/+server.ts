import type { User } from "$lib/types";
import { redirect } from "sveltekit-flash-message/server";
import type { RequestHandler } from "./$types";

const DefaultUser: User = <User>{};

export const POST: RequestHandler = ({ locals, cookies }) => {
  console.log("logout server clearing user");
  locals.pb.authStore.clear();
  locals.user = DefaultUser;
  const message = {
    type: "success",
    message: "Logout successful!",
  } as const;
  throw redirect(303, "/", message, cookies);
};
export const GET: RequestHandler = ({ locals, cookies }) => {
  console.log("logout server clearing user");
  locals.pb.authStore.clear();
  locals.user = DefaultUser;
  const message = {
    type: "success",
    message: "Logout successful!",
  } as const;
  throw redirect(303, "/", message, cookies);
};
