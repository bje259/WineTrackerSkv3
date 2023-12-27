import type { RequestHandler } from "./$types";
import * as vivino from "$lib/vivino";

//get wines
export const GET: RequestHandler = async ({ request, params }) => {
  //await vivino.run()

  return new Response();
};
