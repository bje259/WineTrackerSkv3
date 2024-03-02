import { error, json, type RequestEvent } from "@sveltejs/kit";
import {
  ClientResponseError,
  type ListOptions,
  type ListResult,
} from "pocketbase";
import { z } from "zod";
import pb from "pocketbase";
import { p, pt, PO } from "$lib/utils.js";
import type {
  WineInfo,
  WineFacts,
  Recommendedvintage,
  Stylestats,
  BaseStats,
} from "../../../lib";
import {
  type WineInfoDataResponse,
  type TypedPocketBase,
  WineInfoDataResponseSchema,
  validateZodResponseSchema,
  Collections,
  type CollectionResponses,
  type UserRoleAssignmentsRecord,
} from "$lib/WineTypes.js";
import {
  router,
  createCallerFactory,
  type RouterInputs,
  type RouterOutputs,
} from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";
import { addEventListener } from "$utils/cmdk/internal/index.js";
let log = new PO();
export async function POST({ locals, params: { collection }, request, url }) {
  // log.pt("user: ", locals.user);
  // log.pt("admin: ", locals.admin);
  // if (!locals.user && !locals.admin) error(403, "Forbidden");
  const body = await request.json();
  log = locals.log || log;
  // const bodyTest = body.slice(0, 1);
  const bodyTest = body; //{ name: "test", type: "text" };
  const bodyTestString = JSON.stringify(bodyTest);
  log.p("bodyTest:", bodyTest);
  log.p(`POST locals.pb.collection(${collection}).create(${bodyTest});`);
  log.p(`POST locals.pb.collection(${collection}).create(${bodyTestString});`);
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
    log.p("data", JSON.stringify(data));
    return json(data);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      log.p("error", e);
      error(e.response.code || 500, e.response.message);
    }
  }
  return json(undefined);
}

// export async function POST({ locals, params: { collection }, request, url }) {
//   log.pt("user: ", locals.user);
//   log.pt("admin: ", locals.admin);
//   if (!locals.user && !locals.admin) error(403, "Forbidden");
//   const body: WineInfo[] = await request.json();
//   const bodyTest: WineInfo = body.slice(0, 1)[0];
//   const bodyTestString = JSON.stringify(bodyTest);
//   log.p("bodyTest:", bodyTest);
//   log.p(`POST locals.pb.collection(${collection}).create(${bodyTest});`);
//   log.p(`POST locals.pb.collection(${collection}).create(${bodyTestString});`);
//   try {
//     const data = await locals.pb
//       .collection(collection)
//       .create({ body: bodyTestString });
//     log.p(data.slice(0, 5));
//     return json(data);
//   } catch (e: unknown) {
//     if (e instanceof ClientResponseError && !e.isAbort) {
//       error(e.response.code || 500, e.response.message);
//     }
//   }
//   return json(undefined);
// }

// export async function POST({ locals, params: { collection }, request }) {
//   log.pt("user: ", locals.user);
//   log.pt("admin: ", locals.admin);
//   if (!locals.user && !locals.admin) error(403, "Forbidden");
//   const body = await request.json();
//   log.p(body);
//   const bodyTest = body;
//   const bodyTestString = JSON.stringify(bodyTest);
//   let newCollection: Response;

//   const currentCollection = await locals.pb.collections.getFullList({
//     sort: "-created",
//   });

//   if (currentCollection) {
//     log.p("currentCollection: ", currentCollection);
//     const currentCollectionArray = currentCollection.malog.p(
//       (collection) => collection.name
//     );
//     log.p("currentCollectionArray: ", currentCollectionArray);
//     if (currentCollectionArray.includes(collection)) {
//       log.p("collection exists");
//     } else {
//       log.p("collection does not exist");
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
//           log.p(newCollection);
//           // log.p(newCollection);
//           // ({
//           //         name: collection,
//           //         type: bodyTest.type,
//           //         schema: bodyTest.schema,
//           //       });
//           // if (newCollection.schema === bodyTest.schema) {
//           //   log.p("newCollection: ", newCollection);
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
//     log.p(data);
//     return json(data);
//   } catch (e: unknown) {
//     if (e instanceof ClientResponseError && !e.isAbort) {
//       error(e.response.code || 500, e.response.message);
//     }
//   }

//   return json(undefined);
// }

export async function GET(event: RequestEvent) {
  const {
    locals,
    params: { collection },
    url,
  } = event;
  log = locals.log || log;
  log.pt("user: ", locals.user);
  log.pt("admin: ", locals.admin);
  const createCaller = createCallerFactory(router);

  if (!locals.user && !locals.admin) error(403, "Forbidden");
  log.p("Get Params: ", collection);
  const page = url.searchParams.get("page") || "1";
  const perPage = url.searchParams.get("perPage") || "50";
  const sort = url.searchParams.get("sort") || "-id";
  const filter = url.searchParams.get("filter");
  const expand = url.searchParams.get("expand");
  const fields = url.searchParams.get("fields");
  const requestKey = url.searchParams.get("requestKey") || `${collection}List`;
  const test2 = url.searchParams.get("test2") || "";
  const codeFlag = url.searchParams.get("code") != undefined || false;
  const code = url.searchParams.get("code") || "";
  // const resFilter = url.searchParams.get("resFilter") || "";

  const options: ListOptions = { sort, requestKey };
  if (filter) options.filter = filter;
  if (expand) options.expand = expand;
  if (fields) options.fields = fields;

  log.p("codeFlag: ", codeFlag);
  let response: WineInfoDataResponse | undefined;
  if (codeFlag === true && collection === "WineInfoData") {
    try {
      if (options.filter) options.filter += `Code=${code}`;
      else options.filter = `Code=${code}`;
      const data = await locals.pb
        .collection("WineInfoData")
        .getList<WineInfoDataResponse>(
          parseInt(page),
          parseInt(perPage),
          options
        );
      log.p("data: ", data);
      response = data.items[0];
      if (
        await validateZodResponseSchema<WineInfoDataResponse>(
          Collections.WineInfoData,
          response
        )
      ) {
        log.p("wineInfoData validated: ", response);
        return json(response);
      } else {
        log.p("Invalid Schema");
        throw new Error("Invalid Schema");
      }
    } catch (e: unknown) {
      if (e instanceof ClientResponseError && !e.isAbort) {
        error(e.response.code || 500, e.response.message);
      }
    }
  }

  const test = `GET locals.pb
      .collection(${collection})
      .getList(parseInt(${page}), parseInt(${perPage}), ${options});`;
  log.pt([
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
      codeFlag: codeFlag,
      code: code,
    },
  ]);
  log.p(JSON.stringify(options, null, 2));

  try {
    let dataJson: Record<string, unknown> | undefined;
    const caller = createCaller(await createContext(event));
    const data: RouterOutputs["pbCollection"]["getRecords"] =
      await caller.pbCollection.getRecords({
        collection: collection,
        opts: {
          page: parseInt(page),
          perPage: parseInt(perPage),
          sort: sort,
          filter: filter,
          expand: expand,
          fields: fields,
          requestKey: requestKey,
        },
      } as RouterInputs["pbCollection"]["getRecords"]);

    //   type t = CollectionResponses[keyof CollectionResponses];
    //   let collectionData: ListResult<t> | undefined;
    //   let testResults: any;
    //   if (test2 === "test2") {
    //     data = await fetch("http://127.0.0.1:8090/test2", {
    //       method: "GET",
    //     });
    //     log.p("test2detected");
    //     dataJson = await data.json();

    //     log.p("dataJson: ", dataJson);
    //   } else {
    //     log.pt(
    //       "collection: ",
    //       collection,
    //       "page: ",
    //       parseInt(page),
    //       "perPage: ",
    //       parseInt(perPage),
    //       "options: ",
    //       options
    //     );
    //     collectionData = await locals.pb
    //       .collection(collection)
    //       .getList(parseInt(page), parseInt(perPage), options);
    //     if (!collectionData) {
    //       throw new Error("Collection not found");
    //     }

    //     log.p("data: ", collectionData);
    //     log.p("dataJson: ", dataJson);
    //   }
    //   collectionData = collectionData!;

    //   let expandedData: Record<string, unknown>[] = [];
    //   // if (resFilter && collectionData.items && collectionData.items.length > 0) {
    //   //   log.p("resFilter: ", resFilter);
    //   //   collectionData.items = collectionData.items.filter((item) => {
    //   //     return item.hasOwnProperty(resFilter);
    //   //   });
    //   // }
    //   const sample = collectionData.items.slice(0, 1)[0];
    //   log.p("sample: ", sample);
    //   if (sample.hasOwnProperty("expand")) {
    //     log.p("Expand Detected");

    //     expandedData = collectionData.items.malog.p((item) => {
    //       return flattenJSON(item);
    //     });
    //     // expandedData = flattenData(collectionData.items);
    //     log.p("expandedData: ", expandedData);

    //     log.p("groupedData: ", groupByFirstKeyPart(expandedData[0]));

    //     log.p(
    //       "groupedData2: ",

    //       groupByFirstKeyPart2(expandedData[0] as { [Key: string]: any })
    //     );
    //     const functionTest1 = groupByFirstKeyPart(expandedData[0]);
    //     const functionTest2 = groupByFirstKeyPart2(
    //       expandedData[0] as {
    //         [Key: string]: any;
    //       }
    //     );
    //     const cb = (item: [string, any], index: number) => {
    //       const key = item[0];
    //       const splitKey = key.split(".");
    //       if (key.indexOf(".") === -1) {
    //         return splitKey[0];
    //       } else {
    //         return splitKey[0] + ".";
    //       }
    //     };
    //     const objGrpRes = Object.groupBy(Object.entries(expandedData[0]), cb);
    //     const mapGrpRes = Map.groupBy(Object.entries(expandedData[0]), cb);
    //     log.p("groupMap: ", mapGrpRes);
    //     // log.p("groupMap: ", Map.groupBy(Object.entries(expandedData[0]), cb));
    //     collectionData.items = expandedData as t[];
    //     testResults = {
    //       expandedData: expandedData[0],
    //       functionTest1: functionTest1,
    //       functionTest2: functionTest2,
    //       objGrpRes: objGrpRes,
    //       mapGrpRes: Object.fromEntries(mapGrpRes.entries()),
    //     };
    //   }
    // log.p("testResults: ", testResults);

    // return json(dataJson || testResults || collectionData.items);

    if (data) {
      log.p("data.items: ", data);
      return json(data);
    } else {
      throw new Error("Collection not found");
    }
    // return json(data.items);
  } catch (e: unknown) {
    if (e instanceof ClientResponseError && !e.isAbort) {
      error(e.response.code || 500, e.response.message);
    }
  }

  return json(undefined);
}

const flattenJSON = (
  obj: Record<string, unknown>,
  res: Record<string, unknown> = {},
  extraKey: string = ""
): Record<string, unknown> => {
  let newKey = "";
  for (const key in obj) {
    if (typeof obj[key] !== "object") {
      //const newKey = (key==='expand') ? '' : key
      newKey = key === "expand" ? "" : key;
      res[extraKey + newKey] = obj[key];
    } else {
      if (obj[key]) {
        const newKey = key === "expand" ? extraKey : extraKey + key + ".";
        flattenJSON(obj[key] as Record<string, unknown>, res, newKey);
      }
    }
  }
  return res;
};

// function groupByFirstKeyPart(
//   flattenedObj: Record<string, unknown>
// ): Record<string, Record<string, unknown>> {
//   return Object.entries(flattenedObj).reduce(
//     (acc, [key, value]) => {
//       let groupKey = "";
//       const splitKey = key.split(".");
//       if (key.indexOf(".") === -1) {
//         groupKey = splitKey[0];
//       } else {
//         groupKey = splitKey[0] + ".";
//       }
//       // Get the substring before the first period
//       if (!acc[groupKey]) acc[groupKey] = {};
//       acc[groupKey][key] = value;
//       return acc;
//     },
//     {} as Record<string, Record<string, unknown>>
//   );
// }

// function groupByFirstKeyPart2(flattenedObj: {
//   [Key: string]: any;
// }): Record<string, unknown> {
//   const flatMap = new Map<string, any>(Object.entries(flattenedObj));
//   const flattenedObjArray = Array.from(flatMap);
//   const f2t1 = Object.groupBy(flattenedObjArray, (item: [string, any]) => {
//     const key = item[0];
//     const splitKey = key.split(".");
//     if (key.indexOf(".") === -1) {
//       return splitKey[0];
//     } else {
//       return splitKey[0] + ".";
//     }
//   });
//   const f2t2 = Object.groupBy(
//     flatMap.entries(),
//     (item: [string, any], index: number) => {
//       const key = item[0];
//       const splitKey = key.split(".");
//       if (key.indexOf(".") === -1) {
//         return splitKey[0];
//       } else {
//         return splitKey[0] + ".";
//       }
//     }
//   );
//   return {
//     f2t1: f2t1,
//     f2t2: f2t2,
//   };
// }

// export async function POST({ locals, params: { collection }, request }) {
//   log.pt("user: ", locals.user);
//   log.pt("admin: ", locals.admin);
//   if (!locals.user && !locals.admin) error(403, "Forbidden");
//   const body = await request.json();
//   log.p(body);
// const bodyTest = body;
// const bodyTestString = JSON.stringify(bodyTest);

// const currentCollection = await locals.pb.collections.getFullList({
//   sort: "-created",
// });

// if (currentCollection) {
//   log.p("currentCollection: ", currentCollection);
//   const currentCollectionArray = currentCollection.malog.p(
//     (collection) => collection.name
//   );
//   log.p("currentCollectionArray: ", currentCollectionArray);
//   if (currentCollectionArray.includes(collection)) {
//     log.p("collection exists");
//   } else {
//     log.p("collection does not exist");
//     if (bodyTest.name && bodyTest.type && bodyTest.schema) {
//       try {
//         const newCollection = await locals.pb.collections.create({
//           name: collection,
//           type: bodyTest.type,
//           schema: bodyTest.schema,
//         });
//         if (newCollection.schema === bodyTest.schema) {
//           log.p("newCollection: ", newCollection);
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
//     log.p(data);
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
