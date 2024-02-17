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

export async function POST({ locals, params: { collection }, request, url }) {
  // pt("user: ", locals.user);
  // pt("admin: ", locals.admin);
  // if (!locals.user && !locals.admin) error(403, "Forbidden");
  const body = await request.json();
  // const bodyTest = body.slice(0, 1);
  const bodyTest = body; //{ name: "test", type: "text" };
  const bodyTestString = JSON.stringify(bodyTest);
  p("bodyTest:", bodyTest);
  p(`POST locals.pb.collection(${collection}).create(${bodyTest});`);
  p(`POST locals.pb.collection(${collection}).create(${bodyTestString});`);
  // const foodPairings = bodyTest.foodPairings;
  try {
    const data = await locals.pb
      .collection(collection)
      .create(bodyTest, { requestKey: null });
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

// export async function POST({ locals, params: { collection }, request }) {
//   pt("user: ", locals.user);
//   pt("admin: ", locals.admin);
//   if (!locals.user && !locals.admin) error(403, "Forbidden");
//   const body = await request.json();
//   p(body);
//   const bodyTest = body;
//   const bodyTestString = JSON.stringify(bodyTest);
//   let newCollection: Response;

//   const currentCollection = await locals.pb.collections.getFullList({
//     sort: "-created",
//   });

//   if (currentCollection) {
//     p("currentCollection: ", currentCollection);
//     const currentCollectionArray = currentCollection.map(
//       (collection) => collection.name
//     );
//     p("currentCollectionArray: ", currentCollectionArray);
//     if (currentCollectionArray.includes(collection)) {
//       p("collection exists");
//     } else {
//       p("collection does not exist");
//       if (bodyTest.name && bodyTest.type && bodyTest.schema) {
//         try {
//           const newCollection = await fetch(
//             `http://localhost:5173/api/collections`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: bodyTestString,
//             }
//           );
//           p(newCollection);
//           // p(newCollection);
//           // ({
//           //         name: collection,
//           //         type: bodyTest.type,
//           //         schema: bodyTest.schema,
//           //       });
//           // if (newCollection.schema === bodyTest.schema) {
//           //   p("newCollection: ", newCollection);
//           // } else {
//           //   throw error(500, "Collection not created");
//           // }
//         } catch (e: unknown) {
//           if (e instanceof ClientResponseError && !e.isAbort) {
//             error(e.response.code || 500, e.response.message);
//           }
//         }
//       }
//     }
//   }

//   try {
//     const data = await locals.pb.collection(collection).create(body);
//     p(data);
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
  const test2 = url.searchParams.get("test2") || "";

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
      test2: test2,
    },
  ]);
  p(JSON.stringify(options, null, 2));

  try {
    let data;
    let dataJson;
    if (test2 === "test2") {
      data = await fetch("http://127.0.0.1:8090/test2", {
        method: "GET",
      });
      p("test2detected");
      dataJson = await data.json();

      p("dataJson: ", dataJson);
    } else {
      pt(
        "collection: ",
        collection,
        "page: ",
        parseInt(page),
        "perPage: ",
        parseInt(perPage),
        "options: ",
        options
      );
      data = await locals.pb
        .collection(collection)
        .getList(parseInt(page), parseInt(perPage), options);
      p("data: ", data);
      p("dataJson: ", dataJson);
    }
    return json(dataJson || data);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      error(e.response.code || 500, e.response.message);
    }
  }

  return json(undefined);
}

// export async function POST({ locals, params: { collection }, request }) {
//   pt("user: ", locals.user);
//   pt("admin: ", locals.admin);
//   if (!locals.user && !locals.admin) error(403, "Forbidden");
//   const body = await request.json();
//   p(body);
// const bodyTest = body;
// const bodyTestString = JSON.stringify(bodyTest);

// const currentCollection = await locals.pb.collections.getFullList({
//   sort: "-created",
// });

// if (currentCollection) {
//   p("currentCollection: ", currentCollection);
//   const currentCollectionArray = currentCollection.map(
//     (collection) => collection.name
//   );
//   p("currentCollectionArray: ", currentCollectionArray);
//   if (currentCollectionArray.includes(collection)) {
//     p("collection exists");
//   } else {
//     p("collection does not exist");
//     if (bodyTest.name && bodyTest.type && bodyTest.schema) {
//       try {
//         const newCollection = await locals.pb.collections.create({
//           name: collection,
//           type: bodyTest.type,
//           schema: bodyTest.schema,
//         });
//         if (newCollection.schema === bodyTest.schema) {
//           p("newCollection: ", newCollection);
//         } else {
//           throw error(500, "Collection not created");
//         }
//       } catch (e: unknown) {
//         if (e instanceof ClientResponseError && !e.isAbort) {
//           error(e.response.code || 500, e.response.message);
//         }
//       }
//     }
//   }
// }

//   try {
//     const data = await locals.pb.collection(collection).create(body);
//     p(data);
//     return json(data);
//   } catch (e: unknown) {
//     if (e instanceof ClientResponseError && !e.isAbort) {
//       error(e.response.code || 500, e.response.message);
//     }
//   }

//   return json(undefined);
// }

// "body" : {
//   "name": "testExpand",
//   "type": "base",
//   "schema": [
//     {
//       "name": "expand",
//       "type": "text",
//       "required": "true",
//     },
//     {
//       "name": "status",
//       "type": "boolean",
//     },
//   ],
// }

// {"Allergens":"Contains sulfites",
// "Grapes":"Dolcetto"
// "Region":"United States / Texas / Texas High Plains"
// "Wine Name":"Wilmeth Vineyard Reserve Dolcetto"
// "Wine style":"Texas Red"
// "Winery":"Becker Vineyards"}
