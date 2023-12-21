// src/hooks.server.ts
import PocketBase from "pocketbase";
import type { Handle } from "@sveltejs/kit";
import { serializeNonPOJOs } from "$lib/utils";
import type { UserDB as User } from "$lib/types";
import { PUBLIC_PB_HOST } from "$env/static/public";

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase(PUBLIC_PB_HOST);

  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || ""
  );

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    event.locals.pb.authStore.isValid &&
      (await event.locals.pb.collection("users").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    console.log("auth refresh failed");
    event.locals.pb.authStore.clear();
  }
  if (event.locals.pb.authStore.isValid) {
    event.locals.user = serializeNonPOJOs<User>(
      event.locals.pb.authStore.model as User
    );
  } else {
    console.log("hooks clearing user");
    event.locals.user = <User>{};
  }

  const response = await resolve(event);

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie()
  );

  return response;
};
