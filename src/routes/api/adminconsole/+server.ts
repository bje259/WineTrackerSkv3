import { error, json } from "@sveltejs/kit";
import { ClientResponseError, type ListOptions } from "pocketbase";
import pb from "pocketbase";
import { p, pt } from "$lib/utils.js";
import type {
  WineInfo,
  WineFacts,
  Recommendedvintage,
  Stylestats,
  BaseStats,
} from "../../../lib";

// export async function GET({ locals, request, url }) {
//   pt("user: ", locals.user);
//   pt("admin: ", locals.admin);

//   if (!locals.user && !locals.admin) error(403, "Forbidden");

//   const { searchParams } = url;

//   return json(undefined);
// }

export async function POST({ locals, url, request }) {
  // pt("user: ", locals.user);
  // pt("admin: ", locals.admin);
  let body;
  let response: Response;
  try {
    if (!locals.user && !locals.admin) error(403, "Forbidden");
    body = await request.json();
    p("body", body);
    pt(body);
    response = await eval(body.code);
    // const data = await locals.pb.collection(collection).create(body);
    // response = new Response("Hello, world!");
    p("response", response);
    return json(response);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      p(request, body);
      error(e.response.code || 500, e.response.message);
    }
  }

  return json(undefined);
}
