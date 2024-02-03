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

// export async function POST({ locals, params: { collection }, request, url }) {
//   pt("user: ", locals.user);
//   pt("admin: ", locals.admin);
//   if (!locals.user && !locals.admin) error(403, "Forbidden");
//   const body: WineInfo[] = await request.json();
//   const bodyTest: WineInfo = body.slice(0, 1)[0];
//   // const bodyTestString = JSON.stringify(bodyTest);
//   p("bodyTest:", bodyTest);
//   // p(`POST locals.pb.collection(${collection}).create(${bodyTest});`);
//   // p(`POST locals.pb.collection(${collection}).create(${bodyTestString});`);
//   const foodPairings = bodyTest.foodPairings;
//   try {
//     // const data = await locals.pb
//     //   .collection(collection)
//     //   .create({ body: bodyTestString });
//     const data: Response[] = [];
//     foodPairings.forEach(async (foodPairing) => {
//       data.push(
//         await locals.pb
//           .collection(collection)
//           .create({ foodPairing: foodPairing }, { requestKey: null })
//       );
//     });
//     p(data);
//     return json(data);
//   } catch (e: unknown) {
//     if (e instanceof ClientResponseError && !e.isAbort) {
//       p("error", e);
//       error(e.response.code || 500, e.response.message);
//     }
//   }
//   return json(undefined);
// }

// export async function POST({ locals, params: { collection }, request, url }) {
//   pt("user: ", locals.user);
//   pt("admin: ", locals.admin);
//   if (!locals.user && !locals.admin) error(403, "Forbidden");
//   const body: WineInfo[] = await request.json();
//   const bodyTest: WineInfo = body.slice(0, 1)[0];
//   const bodyTestString = JSON.stringify(bodyTest);
//   p("bodyTest:", bodyTest);
//   p(`POST locals.pb.collection(${collection}).create(${bodyTest});`);
//   p(`POST locals.pb.collection(${collection}).create(${bodyTestString});`);
//   try {
//     const data = await locals.pb
//       .collection(collection)
//       .create({ body: bodyTestString });
//     p(data.slice(0, 5));
//     return json(data);
//   } catch (e: unknown) {
//     if (e instanceof ClientResponseError && !e.isAbort) {
//       error(e.response.code || 500, e.response.message);
//     }
//   }
//   return json(undefined);
// }

export async function GET({ locals, params: { collection }, url }) {
  pt("user: ", locals.user);
  pt("admin: ", locals.admin);

  if (!locals.user && !locals.admin) error(403, "Forbidden");
  p("Get Params: ", collection);
  const page = url.searchParams.get("page") || "1";
  const perPage = url.searchParams.get("perPage") || "50";
  const sort = url.searchParams.get("sort") || "-created,id";
  const filter = url.searchParams.get("filter");
  const expand = url.searchParams.get("expand");
  const fields = url.searchParams.get("fields");
  const requestKey = url.searchParams.get("requestKey") || `${collection}List`;

  const options: ListOptions = { sort, requestKey };
  if (filter) options.filter = filter;
  if (expand) options.expand = expand;
  if (fields) options.fields = fields;

  const test = `GET locals.pb
      .collection(${collection})
      .getList(parseInt(${page}), parseInt(${perPage}), ${options});`;
  pt([
    {
      page: page,
      perPae: perPage,
      sort: sort,
      filter: filter,
      expand: expand,
      fields: fields,
      requestKey: requestKey,
      options: options,
    },
  ]);
  p(test);

  try {
    const data = await locals.pb
      .collection(collection)
      .getList(parseInt(page), parseInt(perPage), options);
    return json(data);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      error(e.response.code || 500, e.response.message);
    }
  }

  return json(undefined);
}

export async function POST({ locals, params: { collection }, request }) {
  pt("user: ", locals.user);
  pt("admin: ", locals.admin);
  if (!locals.user && !locals.admin) error(403, "Forbidden");
  const body = await request.json();
  p(body);
  try {
    const data = await locals.pb.collection(collection).create(body);
    p(data);
    return json(data);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      error(e.response.code || 500, e.response.message);
    }
  }

  return json(undefined);
}
