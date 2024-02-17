import { error, json } from "@sveltejs/kit";
import { ClientResponseError, type RecordOptions } from "pocketbase";
import { p, pt } from "$lib/utils.js";

export async function GET({ locals, params: { collection, id }, url }) {
  if (!locals.user) error(403, "Forbidden");
  const expand = url.searchParams.get("expand");
  const fields = url.searchParams.get("fields");
  const requestKey = url.searchParams.get("requestKey") || collection + id;
  p("expand", expand, "fields", fields, "requestKey", requestKey);
  const options: RecordOptions = { requestKey };
  if (expand) options.expand = expand;
  if (fields) options.fields = fields;

  try {
    const data = await locals.pb.collection(collection).getOne(id, options);
    return json(data);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      error(e.response.code || 500, e.response.message);
    }
  }

  return json(undefined);
}

export async function PATCH({
  locals,
  params: { collection, id },
  request,
  url,
}) {
  // pt("user: ", locals.user);
  // pt("admin: ", locals.admin);
  // if (!locals.user && !locals.admin) error(403, "Forbidden");
  const body = await request.json();
  // const bodyTest = body.slice(0, 1);
  const bodyTest = body; //{ name: "test", type: "text" };
  const bodyTestString = JSON.stringify(bodyTest);
  p("bodyTest:", bodyTest);
  p(`Patch locals.pb.collection(${collection}).update(${id}, ${bodyTest});`);
  p(
    `Patch locals.pb.collection(${collection}).update(${id}, ${bodyTestString});`
  );
  // const foodPairings = bodyTest.foodPairings;
  try {
    const data = await locals.pb
      .collection(collection)
      .update(id, bodyTest, { requestKey: null });
    // const data = await locals.pb
    //   .collection(collection)
    //   .create({ body: bodyTestString });
    // const data: Response[] = [];
    // foodPairings.forEach(async (foodPairing) => {
    //   data.push(
    //     await locals.pb
    //       .collection(collection)
    //       .create({ foodPairing: foodPairing }, { requestKey: null })
    //   );
    // });
    p("data", JSON.stringify(data));
    return json(data);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      p("error", e);
      error(e.response.code || 500, e.response.message);
    }
  }
  return json(undefined);
}

export async function DELETE({ locals, params: { collection, id } }) {
  if (!locals.user) error(403, "Forbidden");

  try {
    const data = await locals.pb.collection(collection).delete(id);
    return json(data);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      error(e.response.code || 500, e.response.message);
    }
  }

  return json(undefined);
}
